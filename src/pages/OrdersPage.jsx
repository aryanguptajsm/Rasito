import { useEffect } from 'react';
import { orderService } from '../services/dataService';
import config from '../data/config';

export default function OrdersPage() {
  useEffect(() => {
    let active = true;

    orderService.getAll().then((orders) => {
      if (!active || !Array.isArray(orders) || orders.length === 0 || !config.whatsappNumber) return;
      window.location.replace(`https://wa.me/${config.whatsappNumber}`);
    });

    return () => {
      active = false;
    };
  }, []);

  return null;
}
