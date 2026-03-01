# Groww Document Parsing Guide

Parsers for Groww PDF and XLSX exports. Formats match actual Groww downloads.

## Supported File Types
- **PDF**: Dividend Report, Holdings (Demat), ELSS, Balance Statement (when not password-protected)
- **XLSX**: Stocks P&L, Stocks Holdings, Mutual Funds Holdings, Capital Gains, Order History, Balance Statement

## Document Types
| Category | Sub-type | Format | Description |
|----------|----------|--------|-------------|
| **P&L** | stocks | XLSX | Stocks P&L (realised + unrealised trades) |
| | dividend | PDF | Dividend Report |
| **Holdings** | stocks | XLSX | Stocks Holdings Statement |
| | mf | XLSX | Mutual Funds Holdings |
| **Tax** | stocks | XLSX | Stocks Capital Gains |
| | mf_elss | PDF | ELSS (if not password-protected) |
| **Transactions** | stocks | XLSX | Stocks Order History |
| | mf | XLSX | Mutual Funds Order History |
| | balance_statement | XLSX/PDF | Groww Balance Statement |

## Data Extracted

### Holdings (mf, stocks, demat)
- Creates/updates `Holding` records
- Extracts: symbol, isin, name, quantity, avg_price, holding_type
- Stored in `parsed_data.holdings` and `parsed_holdings`

### P&L (stocks, fno, dividend)
- Extracts: transactions, total_realized_pnl, dividend
- Stored in `parsed_data`

### Tax (mf_elss, capital_gains, stocks, fno)
- Extracts: STCG, LTCG, ELSS deductions
- Stored in `parsed_data`

### Transactions (mf, stocks, balance_statement)
- Extracts: transaction list, opening/closing balance
- Stored in `parsed_data`

### GST Invoice / CMR Copy
- Extracts: invoice number, date, amount, raw snippets
- Stored in `parsed_data`

## Parser Locations

- `app/services/groww_pdf_parser.rb` - Main dispatcher
- `app/services/parsers/groww_holdings_parser.rb` - Holdings
- `app/services/parsers/groww_pnl_parser.rb` - P&L
- `app/services/parsers/groww_tax_parser.rb` - Tax
- `app/services/parsers/groww_transactions_parser.rb` - Transactions
- `app/services/parsers/groww_generic_parser.rb` - GST, CMR

## Refining Parsers

When you share sample Groww PDFs:

1. **Inspect the PDF text** - Run in Rails console:
   ```ruby
   s = PortfolioStatement.last
   text = GrowwPdfParser.extract_text(s)
   puts text
   ```

2. **Identify patterns** - Look for:
   - Table headers (Symbol, Qty, Price, etc.)
   - Date formats (DD-MM-YYYY, YYYY-MM-DD)
   - Number formats (1,234.56, ₹1,234)
   - Section markers ("Holdings", "P&L Summary", etc.)

3. **Update the parser** - Add regex/line parsing logic in the relevant parser file.

4. **Test** - Re-upload the PDF and check `parsed_data` in the statement.

## API

- `GET /api/v1/customer/investments/document_types` - List document types
- `POST /api/v1/customer/investments/portfolio_statements` - Upload PDF
  - Params: `file`, `document_type`, `document_sub_type`, `broker`, `statement_date`
