# System Status Monitoring - Frontend Implementation

## Tổng quan

Đây là implementation cho việc hiển thị system status từ backend sử dụng WebSocket hoặc polling.

## Các file đã tạo

### 1. Types (`src/types/system.types.ts`)

Định nghĩa TypeScript types cho system status data.

### 2. Service (`src/services/system.ts`)

Service để call API endpoint `/system/status` để lấy system status.

### 3. Hook (`src/hooks/useSystemStatus.ts`)

Custom React hook để quản lý WebSocket connection hoặc polling:

- **WebSocket mode**: Kết nối real-time với server qua Socket.IO
- **Polling mode**: Tự động fetch data theo interval

### 4. Component (`src/components/SystemStatus.tsx`)

React component để hiển thị system status với:

- Overall status badge
- Uptime information
- Memory usage
- CPU information
- System information
- Application version
- Health checks

### 5. Page (`src/pages/SystemStatusPage.tsx`)

Page component để sử dụng SystemStatus component.

## Cách sử dụng

### Option 1: Sử dụng WebSocket (Real-time)

```tsx
import { SystemStatus } from "@/components/SystemStatus";

export const MyPage = () => {
  return (
    <div>
      <SystemStatus useWebSocket={true} />
    </div>
  );
};
```

### Option 2: Sử dụng Polling

```tsx
import { SystemStatus } from "@/components/SystemStatus";

export const MyPage = () => {
  return (
    <div>
      {/* Poll every 30 seconds */}
      <SystemStatus useWebSocket={false} pollingInterval={30000} />
    </div>
  );
};
```

### Option 3: Sử dụng Hook trực tiếp

```tsx
import { useSystemStatus } from "@/hooks/useSystemStatus";

export const MyCustomComponent = () => {
  const { systemStatus, loading, error, connected, refetch } = useSystemStatus({
    autoConnect: true,
    pollingInterval: 0, // 0 = use WebSocket, > 0 = use polling
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Status: {systemStatus?.status}</h1>
      <p>Connected: {connected ? "Yes" : "No"}</p>
      <button onClick={refetch}>Refresh</button>
      {/* Render your custom UI */}
    </div>
  );
};
```

## Cấu hình

### Environment Variables

Thêm vào file `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### WebSocket Events

Backend emit các events sau:

- `systemStatus`: Nhận system status data
- `connect`: Khi connect thành công
- `disconnect`: Khi disconnect

Frontend emit các events sau:

- `getStatus`: Request system status update

## Features

✅ **Real-time updates** qua WebSocket  
✅ **Polling fallback** nếu không dùng WebSocket  
✅ **Auto-reconnection** khi WebSocket disconnect  
✅ **Error handling** với UI feedback  
✅ **Manual refresh** button  
✅ **Connection status indicator**  
✅ **Formatted display** cho memory, uptime, timestamps  
✅ **Responsive design** với Tailwind CSS  
✅ **TypeScript types** đầy đủ

## API Endpoint

- **GET** `/system/status` - Lấy current system status

## WebSocket Gateway

- **URL**: `ws://localhost:3000` (hoặc từ VITE_API_BASE_URL)
- **Namespace**: default (`/`)
- **Events**:
  - Listen: `systemStatus`, `connect`, `disconnect`
  - Emit: `getStatus`

## Dependencies

Đã cài đặt:

- `socket.io-client` - WebSocket client library

## Tích hợp vào App

### Thêm route vào router:

```tsx
// src/App.tsx hoặc router config
import { SystemStatusPage } from '@/pages/SystemStatusPage';

// Add route
{
  path: '/system-status',
  element: <SystemStatusPage />
}
```

### Thêm vào navigation menu:

```tsx
<Link to="/system-status">System Status</Link>
```

## Troubleshooting

### WebSocket không connect được

1. Kiểm tra `VITE_API_BASE_URL` trong `.env`
2. Kiểm tra backend có chạy WebSocket gateway không
3. Kiểm tra CORS configuration ở backend
4. Check console logs để xem error messages

### Data không update

1. Kiểm tra backend có emit `systemStatus` events không
2. Nếu dùng polling, kiểm tra `pollingInterval` value
3. Check network tab trong DevTools

### Performance issues

1. Tăng `pollingInterval` nếu dùng polling mode
2. Sử dụng WebSocket thay vì polling để giảm requests
3. Xem xét throttle/debounce cho các updates

## Example Usage trong Dashboard

```tsx
import { SystemStatus } from "@/components/SystemStatus";

export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <h1>Dashboard</h1>

      {/* Other dashboard widgets */}

      <SystemStatus useWebSocket={true} />
    </div>
  );
};
```
