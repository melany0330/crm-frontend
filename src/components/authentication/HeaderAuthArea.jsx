import { Link } from 'react-router-dom'
import { FaUserLarge } from 'react-icons/fa6'

const HeaderAuthArea = ({header,title}) => {
  return (
    <div className={`fz-category-area`}>
        <Link to="/account" className="fz-category-btn">
            <FaUserLarge />       
        </Link>
    </div>
  )
}

export default HeaderAuthArea;