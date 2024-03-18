import { Badge } from "@windmill/react-ui";

const Status = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Pending':
        return 'neutral';
      case 'Confirmed':
        return 'success';
      case 'Delivered':
        return 'primary';
      case 'Cancel':
        return 'danger';
      case 'Returned':
        return 'purple'; // Adjust color for "Returned"
      case 'Refund':
        return 'yellow'; // Adjust color for "Refund"
      default:
        return 'default'; //dark:bg-teal-900 bg-teal-100
    }
  };
  return (
    <>
      <span className="font-serif">
        {/* {(status === "Pending" || status === "Inactive") && (
          <Badge type="warning">{status}</Badge>
        )}
        {status === "Waiting for Password Reset" && (
          <Badge type="warning">{status}</Badge>
        )}
        {status === "Processing" && <Badge>{status}</Badge>}
        {(status === "Delivered" || status === "Active") && (
          <Badge type="success">{status}</Badge>
        )}
        {status === "Cancel" && <Badge type="danger">{status}</Badge>}
        {status === `POS-Completed` && (
          <Badge className="dark:bg-teal-900 bg-teal-100">{status}</Badge>
        )} */}
          <Badge type={getStatusColor()}>{status}</Badge>

       
      </span>
    </>
  );
};

export default Status;
