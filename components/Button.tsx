'use client';

import styled from 'styled-components';

const StyledButton = styled.button`
  background: #2563eb;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`;

export default function Button({ children }: { children: React.ReactNode }) {
  return <StyledButton>{children}</StyledButton>;
}