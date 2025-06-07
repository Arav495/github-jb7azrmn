export interface User {
  id: string;
  email: string;
  businessName: string;
  businessType: string;
}

export interface Bill {
  id: string;
  customerEmail: string;
  customerPhone?: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  uploadDate: Date;
  status: 'sent' | 'pending' | 'failed';
  amount?: number;
  customerName?: string;
  transactionId?: string;
  deliveryMethod?: 'email' | 'sms' | 'both';
}

export interface Analytics {
  totalBillsSent: number;
  successRate: number;
  monthlyGrowth: number;
  totalCustomers: number;
  recentActivity: Bill[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}