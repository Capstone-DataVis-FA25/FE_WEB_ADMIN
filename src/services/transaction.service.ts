import apiClient from '@/lib/apiClient';

export interface TransactionItem {
  id: string;
  userId: string | null;
  subscriptionPlanId: string | null;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  provider?: string;
  providerTransactionId?: string;
  metadata?: Record<string, unknown>;
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
    return apiClient.get<TransactionListResponse>('/payments/transactions', { params });
  },

  // Get single transaction detail
  getTransactionDetail: async (id: string): Promise<TransactionItem> => {
    return apiClient.get<TransactionItem>(`/payments/transactions/${id}`);
  },
};

export default transactionService;
