import './JDGDDataTable.css'

const JDGDDataTable = ({ columns, data, onRowClick, emptyText = 'Sin registros' }) => (
  <div className="JDGD-table-wrapper">
    <table className="JDGD-table">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key} style={{ width: col.width }}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0
          ? <tr><td colSpan={columns.length} className="JDGD-table-empty">{emptyText}</td></tr>
          : data.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? 'JDGD-row-clickable' : ''}
              >
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
        }
      </tbody>
    </table>
  </div>
)

export default JDGDDataTable