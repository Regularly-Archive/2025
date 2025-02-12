import { Alert, Snackbar } from '@mui/material';
import { createRoot } from 'react-dom/client';

const BASE_URL = 'https://localhost:64520/';


// 创建一个显示提示信息的函数
const showMessage = (message, severity = 'error') => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  const root = createRoot(container);
  root.render(
    <Snackbar
      open={true}
      autoHideDuration={3000}
      onClose={() => {
        root.unmount();
        container.remove();
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export const request = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
  };

  try {
    const response = await fetch(`${BASE_URL}${url}`, finalOptions);
    const data = await response.json();

    if (response.ok) {
      if (data.code === 200) {
        return data;
      }
    }
    
    if (data.code === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('登录已过期，请重新登录');
    }

    throw new Error(data.message || '请求失败');
  } catch (error) {
    showMessage(error.message);
    throw error;
  }
};

export const get = (url, options = {}) => request(url, { ...options, method: 'GET' });
export const post = (url, data, options = {}) => request(url, { ...options, method: 'POST', body: JSON.stringify(data) });
export const put = (url, data, options = {}) => request(url, { ...options, method: 'PUT', body: JSON.stringify(data) });
export const del = (url, options = {}) => request(url, { ...options, method: 'DELETE' }); 