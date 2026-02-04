import { useEffect } from 'react';
import { useRouter } from 'next/router';

const SuccessPage = () => {
  const router = useRouter();
  const { orderId } = router.query;

  useEffect(() => {
    // Redirect to the new animated payment success page
    if (orderId) {
      router.push(`/payment-success?orderId=${orderId}`);
    } else {
      router.push('/payment-success');
    }
  }, [orderId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amazon_blue"></div>
    </div>
  );
};

export default SuccessPage;