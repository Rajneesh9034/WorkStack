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
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password required')
});

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema)
  });
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await api.post('/register', data);
     if(res.data.success){
         auth.login(res.data.token, { id: res.data.user.id || res.data.user._id, email: res.data.user.email });
      navigate('/');
      }else{
        alert(res.data.message || 'Login failed1');
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="card-title text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder="Enter your email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              {...register('password')}
              type="password"
              id="password"
              placeholder="Enter your password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{' '}
          <Link to="/login" className="text-primary fw-bold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
