// ... existing imports ...
import { FileText } from 'lucide-react';

// ... existing code ...

const DeliveryOrderList = () => {
  // ... existing state and hooks ...
  const navigate = useNavigate();

  // ... existing code ...

  return (
    // ... existing JSX ...
    <TableBody>
      {data.orders.map((order) => (
        <TableRow key={order.id} className="hover:bg-blue-50">
          {/* ... existing cells ... */}
          <TableCell className="text-right">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-blue-600 hover:bg-blue-100"
              onClick={() => handleViewDetail(order.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {order.status === '已发货' && (
              <Button 
                variant="ghost" 
                size="icon"
                className="text-green-600 hover:bg-green-100 ml-1"
                onClick={() => navigate(`/finance/generate-invoice/${order.id}`)}
              >
                <FileText className="h-4 w-4" />
              </Button>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
    // ... rest of the code ...
  );
};

export default DeliveryOrderList;
