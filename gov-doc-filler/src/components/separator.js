// src/components/Separator.js

import React from 'react';

const Separator = ({ title }) => (
  <div className="separator">
    <hr />
    {title && <h4>{title}</h4>}
  </div>
);

export default Separator;
