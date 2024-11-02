import { ButtonProps } from '../types/types';

export const Button = ({ btnName, clickHandler }: ButtonProps) => {
  return (
    <div className="create-btn">
      <button onSubmit={(e) => clickHandler(e)}>{ btnName }</button>
    </div>
  )
}