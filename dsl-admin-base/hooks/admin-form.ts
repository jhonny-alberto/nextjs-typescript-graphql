import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { notification } from 'antd';
import { FormInstance } from 'antd/lib/form';

export function useAdminForm<T>(fn: (id: number) => Promise<T>) {
  const router = useRouter();
  const formInstance = useRef<FormInstance>(null);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T>();
  const id = parseInt(router.query.id as string) || undefined;
  const isAdd = router.query.id === 'new';

  const showErrorMessage = (message?: string) => {
    notification.error({
      message: 'Error',
      description: message || 'Error occurred',
    });
  };

  const showSuccessMessage = () => {
    notification.success({
      message: 'Saved',
      description: 'Your change has been saved',
    });
  };

  const submitForm = () => {
    formInstance.current?.submit();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fn(parseInt(router.query.id as string));
        if (response) {
          setData(response);
        }
      } catch (e) {
        console.log(e);
        showErrorMessage();
      }
      setLoading(false);
    };

    if (!isAdd) {
      fetchData();
    }
  }, [router.query.id, reload]);

  const reloadPage = () => setReload(!reload);

  return {
    reloadPage,
    loading,
    data,
    isAdd,
    showErrorMessage,
    showSuccessMessage,
    submitForm,
    formInstance,
    id,
    router,
  };
}
