import { axiosPrivate } from './axios';

export interface TransactionItem {
  id: string;
  userId: string | null;
  subscriptionPlanId: string | null;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  provider?: string;
  providerTransactionId?: string;
  metadata?: json;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  subscriptionPlan?: {
    id: string;
    name: string;
    price: number;
    currency: string;
  };
}

export interface TransactionListResponse {
  data: TransactionItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const transactionService = {
  // Admin: Get all transactions with filters
  getAllTransactions: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    userId?: string;
  }): Promise<TransactionListResponse> => {
    const response = await axiosPrivate.get('/payments/transactions', { params });
    return response.data;
  },

  // Get single transaction detail
  getTransactionDetail: async (id: string): Promise<TransactionItem> => {
    const response = await axiosPrivate.get(`/payments/transactions/${id}`);
    return response.data;
  },
};

export default transactionService;
