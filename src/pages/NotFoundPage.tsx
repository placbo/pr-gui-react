import React, { FC } from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: FC = () => {
  return (
    <div>
      <h1>404</h1>
      <Link to={'/'}>Go home!</Link>
    </div>
  );
};
