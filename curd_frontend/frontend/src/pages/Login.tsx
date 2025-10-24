import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../services/Api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

type FormValues = { email: string; password: string };

const schema = yup.object().shape({
  email: yup.string().email().required('Email required'),
  password: yup.string().required('Password required')
});

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema)
  });
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    try {
        console.log('hiii');
      const res = await api.post('/login', data);
      console.log("check",res);
      if(res.data.success){
         auth.login(res.data.token, { id: res.data.user.id || res.data.user._id, email: res.data.user.email });
      navigate('/');
      }else{
        alert(res.data.message || 'Login failed1');
      }
    
    } catch (err: any) {
        console.log(err);
      alert(err?.response?.data?.message || 'Login failed2');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="card-title text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              {...register('email')}
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              placeholder="Enter your email"
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              {...register('password')}
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              placeholder="Enter your password"
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        <p className="text-center mt-3">
          Don’t have an account?{' '}
          <Link to="/register" className="text-primary fw-bold">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
