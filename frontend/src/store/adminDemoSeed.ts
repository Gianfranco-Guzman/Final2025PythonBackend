import { api } from "../api/client";
import {
  ApiAddress,
  ApiBill,
  ApiClient,
  ApiOrder,
  ApiOrderDetail,
  ApiProduct,
  ApiReview
} from "../api/types";

type DemoClientSeed = {
  name: string;
  lastname: string;
  email: string;
  telephone: string;
  street: string;
  number: string;
  city: string;
};

const demoClientsSeed: DemoClientSeed[] = [
  {
    name: "Lucía",
    lastname: "Fernández",
    email: "lucia.demo@techstore.com",
    telephone: "+5491133311101",
    street: "Av. Santa Fe",
    number: "2450",
    city: "Buenos Aires"
  },
  {
    name: "Tomás",
    lastname: "Rojas",
    email: "tomas.demo@techstore.com",
    telephone: "+5491133311102",
    street: "Calle 9",
    number: "128",
    city: "La Plata"
  },
  {
    name: "Valentina",
    lastname: "Méndez",
    email: "valentina.demo@techstore.com",
    telephone: "+5491133311103",
    street: "Bv. Oroño",
    number: "940",
    city: "Rosario"
  }
];

type SeedSummary = {
  clients: number;
  addresses: number;
  bills: number;
  orders: number;
  orderDetails: number;
  reviews: number;
};

const getOrCreateClient = async (
  existingClients: ApiClient[],
  seed: DemoClientSeed
): Promise<{ client: ApiClient; created: boolean }> => {
  const normalizedEmail = seed.email.toLowerCase();
  const client = existingClients.find(
    (item) => (item.email ?? "").toLowerCase() === normalizedEmail
  );

  if (client) {
    return { client, created: false };
  }

  const created = await api.createClient({
    name: seed.name,
    lastname: seed.lastname,
    email: seed.email,
    telephone: seed.telephone
  });

  return { client: created, created: true };
};

const getOrCreateAddress = async (
  existingAddresses: ApiAddress[],
  seed: DemoClientSeed,
  clientId: number
): Promise<{ address: ApiAddress; created: boolean }> => {
  const address = existingAddresses.find((item) => item.client_id === clientId);

  if (address) {
    return { address, created: false };
  }

  const created = await api.createAddress({
    street: seed.street,
    number: seed.number,
    city: seed.city,
    client_id: clientId
  });

  return { address: created, created: true };
};

const getOrCreateBill = async (
  existingBills: ApiBill[],
  clientId: number,
  total: number
): Promise<{ bill: ApiBill; created: boolean }> => {
  const bill = existingBills.find((item) => item.client_id === clientId);

  if (bill) {
    return { bill, created: false };
  }

  const billNumber = `DEMO-${clientId}-${Date.now()}`;
  const today = new Date().toISOString().slice(0, 10);

  const created = await api.createBill({
    bill_number: billNumber,
    discount: 0,
    date: today,
    total,
    payment_type: 1,
    client_id: clientId
  });

  return { bill: created, created: true };
};

const getOrCreateOrder = async (
  existingOrders: ApiOrder[],
  clientId: number,
  billId: number,
  total: number
): Promise<{ order: ApiOrder; created: boolean }> => {
  const order = existingOrders.find(
    (item) => item.client_id === clientId && item.bill_id === billId
  );

  if (order) {
    return { order, created: false };
  }

  const created = await api.createOrder({
    date: new Date().toISOString(),
    total,
    delivery_method: 1,
    status: 1,
    client_id: clientId,
    bill_id: billId
  });

  return { order: created, created: true };
};

const createOrderDetailsIfNeeded = async (
  existingOrderDetails: ApiOrderDetail[],
  orderId: number,
  products: ApiProduct[]
): Promise<number> => {
  const existingForOrder = existingOrderDetails.filter(
    (item) => item.order_id === orderId
  );

  if (existingForOrder.length > 0) {
    return 0;
  }

  let createdCount = 0;
  for (const product of products.slice(0, 2)) {
    await api.createOrderDetail({
      quantity: 1,
      price: product.price,
      order_id: orderId,
      product_id: product.id_key
    });
    createdCount += 1;
  }

  return createdCount;
};

const createReviewIfNeeded = async (
  existingReviews: ApiReview[],
  productId: number,
  seed: DemoClientSeed
): Promise<boolean> => {
  const existing = existingReviews.find((item) => item.product_id === productId);

  if (existing) {
    return false;
  }

  await api.createReview({
    rating: 4.5,
    comment: `Reseña de ${seed.name}: muy buena experiencia de compra y entrega.`,
    product_id: productId
  });

  return true;
};

export const seedAdminDemoData = async (): Promise<SeedSummary> => {
  const [clients, addresses, bills, orders, orderDetails, reviews, products] =
    await Promise.all([
      api.getClients(),
      api.getAddresses(),
      api.getBills(),
      api.getOrders(),
      api.getOrderDetails(),
      api.getReviews(),
      api.getProducts()
    ]);

  if (products.length < 2) {
    throw new Error(
      "Necesitas al menos 2 productos cargados para generar órdenes de ejemplo."
    );
  }

  const summary: SeedSummary = {
    clients: 0,
    addresses: 0,
    bills: 0,
    orders: 0,
    orderDetails: 0,
    reviews: 0
  };

  const mutableClients = [...clients];
  const mutableAddresses = [...addresses];
  const mutableBills = [...bills];
  const mutableOrders = [...orders];
  const mutableOrderDetails = [...orderDetails];
  const mutableReviews = [...reviews];

  for (let index = 0; index < demoClientsSeed.length; index += 1) {
    const seed = demoClientsSeed[index];

    const clientResult = await getOrCreateClient(mutableClients, seed);
    if (clientResult.created) {
      summary.clients += 1;
      mutableClients.push(clientResult.client);
    }

    const addressResult = await getOrCreateAddress(
      mutableAddresses,
      seed,
      clientResult.client.id_key
    );
    if (addressResult.created) {
      summary.addresses += 1;
      mutableAddresses.push(addressResult.address);
    }

    const selectedProducts = products.slice(index, index + 2);
    const productsForOrder =
      selectedProducts.length >= 2 ? selectedProducts : products.slice(0, 2);
    const total = productsForOrder.reduce((acc, product) => acc + product.price, 0);

    const billResult = await getOrCreateBill(
      mutableBills,
      clientResult.client.id_key,
      total
    );
    if (billResult.created) {
      summary.bills += 1;
      mutableBills.push(billResult.bill);
    }

    const orderResult = await getOrCreateOrder(
      mutableOrders,
      clientResult.client.id_key,
      billResult.bill.id_key,
      total
    );
    if (orderResult.created) {
      summary.orders += 1;
      mutableOrders.push(orderResult.order);
    }

    const createdDetails = await createOrderDetailsIfNeeded(
      mutableOrderDetails,
      orderResult.order.id_key,
      productsForOrder
    );
    if (createdDetails > 0) {
      summary.orderDetails += createdDetails;
      const refreshedOrderDetails = await api.getOrderDetails();
      mutableOrderDetails.splice(0, mutableOrderDetails.length, ...refreshedOrderDetails);
    }

    const productForReview = productsForOrder[0];
    const createdReview = await createReviewIfNeeded(
      mutableReviews,
      productForReview.id_key,
      seed
    );
    if (createdReview) {
      summary.reviews += 1;
      const refreshedReviews = await api.getReviews();
      mutableReviews.splice(0, mutableReviews.length, ...refreshedReviews);
    }
  }

  return summary;
};
