import { getCategoryMeta } from '../../constants/categories'

const Badge = ({ category }) => {
    const meta = getCategoryMeta(category)
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{
                background: `${meta.color}18`,
                color: meta.color,
            }}
        >
            <span>{meta.icon}</span>
            {category}
        </span>
    )
}

export default Badge