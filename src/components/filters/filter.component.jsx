import { useDispatch, useSelector } from 'react-redux';
import { updateCompany } from '../../state/query.slice';
import magnifyGlass from '../../assets/svgs/magniy_glass_icon.svg';
import './filter.style.scss';
export const Filter = () => {
  // dispatch
  const dispatch = useDispatch();
  const company = useSelector((state) => state.query.company);

  // update company
  const updateQueryCompany = (e) => {
    dispatch(updateCompany(e.target.value));
  };
  return (
    <div className="filter-div">
      <div className="input-container">
        <img src={magnifyGlass} alt="magnify glass icon" />
        <input
          autoFocus
          type="text"
          placeholder="Company"
          onChange={updateQueryCompany}
          value={company}
        />
      </div>
    </div>
  );
};
