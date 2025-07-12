import React from 'react'

const TableRenderer = ({ children, ...props }) => {
  return (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-chatbot-border" {...props}>
        {children}
      </table>
    </div>
  )
}

export default TableRenderer