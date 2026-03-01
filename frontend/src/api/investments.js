import api from './axios'

const BASE = '/customer/investments'

export const getInvestmentsDashboard = () => api.get(`${BASE}/dashboard`)
export const getPortfolio = () => api.get(`${BASE}/portfolio`)
export const syncPortfolio = () => api.post(`${BASE}/sync`)
export const buildPortfolioFromDocuments = () => api.post(`${BASE}/build_portfolio_from_documents`)
export const getParsedSummary = () => api.get(`${BASE}/parsed_summary`)
export const getInvestingOpportunities = () => api.get(`${BASE}/investing_opportunities`)
export const getReports = () => api.get(`${BASE}/reports`)
export const exportReport = async (format = 'csv') => {
  const res = await api.get(`${BASE}/reports/export`, { params: { format }, responseType: 'blob' })
  return res.data
}
export const getSellTiming = (horizon) => api.get(`${BASE}/sell_timing`, { params: { horizon } })
export const getTips = (mode, symbol) => api.get(`${BASE}/tips`, { params: { mode, symbol } })

export const getHoldings = () => api.get(`${BASE}/holdings`)
export const createHolding = (data) => api.post(`${BASE}/holdings`, data)
export const updateHolding = (id, data) => api.patch(`${BASE}/holdings/${id}`, data)
export const deleteHolding = (id) => api.delete(`${BASE}/holdings/${id}`)

export const getPnlRecords = (params) => api.get(`${BASE}/pnl_records`, { params })
export const createPnlRecord = (data) => api.post(`${BASE}/pnl_records`, data)
export const updatePnlRecord = (id, data) => api.patch(`${BASE}/pnl_records/${id}`, data)
export const deletePnlRecord = (id) => api.delete(`${BASE}/pnl_records/${id}`)

export const getTaxRecords = () => api.get(`${BASE}/tax_records`)
export const createTaxRecord = (data) => api.post(`${BASE}/tax_records`, data)
export const updateTaxRecord = (id, data) => api.patch(`${BASE}/tax_records/${id}`, data)
export const deleteTaxRecord = (id) => api.delete(`${BASE}/tax_records/${id}`)

export const getTransactions = (params) => api.get(`${BASE}/transactions`, { params })
export const createTransaction = (data) => api.post(`${BASE}/transactions`, data)
export const updateTransaction = (id, data) => api.patch(`${BASE}/transactions/${id}`, data)
export const deleteTransaction = (id) => api.delete(`${BASE}/transactions/${id}`)

export const getSnapshots = (params) => api.get(`${BASE}/snapshots`, { params })
export const createSnapshot = (data) => api.post(`${BASE}/snapshots`, data)
export const updateSnapshot = (id, data) => api.patch(`${BASE}/snapshots/${id}`, data)
export const deleteSnapshot = (id) => api.delete(`${BASE}/snapshots/${id}`)

export const getDocumentTypes = () => api.get(`${BASE}/document_types`)

export const getStatements = () => api.get(`${BASE}/portfolio_statements`)
export const getStatement = (id) => api.get(`${BASE}/portfolio_statements/${id}`)
export const updateStatement = (id, data) => api.patch(`${BASE}/portfolio_statements/${id}`, data)
export const retryParseStatement = (id) => api.post(`${BASE}/portfolio_statements/${id}/retry_parse`)
export const uploadStatement = (file, { broker, statementDate, documentType, documentSubType } = {}) => {
  const form = new FormData()
  form.append('file', file)
  if (broker) form.append('broker', broker)
  if (statementDate) form.append('statement_date', statementDate)
  if (documentType) form.append('document_type', documentType)
  if (documentSubType) form.append('document_sub_type', documentSubType)
  return api.post(`${BASE}/portfolio_statements`, form)
}

export const getStrategies = () => api.get(`${BASE}/investment_strategies`)
export const createStrategy = (data) => api.post(`${BASE}/investment_strategies`, data)
export const updateStrategy = (id, data) => api.patch(`${BASE}/investment_strategies/${id}`, data)
export const deleteStrategy = (id) => api.delete(`${BASE}/investment_strategies/${id}`)
