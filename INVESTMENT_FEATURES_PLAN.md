# Investment Features – Plan & Questions

## Vision (from your description)

- Gate access **based on `email_verified`**
- Integrate with **Groww** – login and fetch stocks, mutual funds, investment portfolio
- Show **P&L** (profit and loss)
- **Investment tips and tricks** – how to invest, what to buy/sell and when
- Use **Screener** and **Tickertape** for data and future predictions 
#Not restrict yourself to these two  use as many services available free as you can 
also give me sell timing like for 1 day 1 month 15 days etc

also use trading view and use best indicators to represent 
based on you research 
- **Monthly and yearly reports**
- Buy/sell recommendations with timing

---

## Research Findings

### Groww API
- **Official Trade API** – [groww.in/trade-api](https://groww.in/trade-api/docs)
- Supports: holdings, positions, live data, order placement, WebSocket streaming
- Auth: API Key + Secret (daily approval) or TOTP (no expiry)
- Python SDK: `pip install growwapi`
- Covers NSE, BSE, MCX (equities, derivatives, commodities)

### Screener.in
- **No official API**
- Data via scraping (e.g. [BuildAlgos/screener-scraper](https://github.com/BuildAlgos/screener-scraper))
- Data: financials, ratios, shareholding, announcements, price charts
- CSV export available for screen results

### Tickertape
- **API**: `https://api.tickertape.in`
- Via Bharat Stock Market Data library
- Data: ticker search, financials, peer comparison, scorecards, index constituents

---

## Clarifying Questions (fill in your answers below)

### 1. App scope
How should this relate to SSS BAGS?

- [ ] **A**: Add as a new module inside SSS BAGS (keep e-commerce + add investments)
- [ ] **B**: Build as a separate app/project (investments only)
- [ ] **C**: Replace SSS BAGS focus (pivot from bags to investments)

**Your answer:** option a 

---

### 2. Groww authentication
What does “login the Groww account” mean for you?

- [ ] **A**: User logs into SSS BAGS, then links their Groww account (API key/TOTP) to fetch their portfolio
- [ ] **B**: Use Groww as the main login (user signs in with Groww, we don’t have our own auth)
- [ ] **C**: User manually enters holdings (no Groww integration)

**Your answer:** B

---

### 3. Buy/sell recommendations
How should tips and recommendations be generated?

- [ ] **A**: Display Screener/Tickertape data only – user decides (no explicit buy/sell advice)
- [ ] **B**: Use AI/LLM to generate recommendations from the data
- [ ] **C**: Rule-based signals (e.g. PE < 20, ROE > 15%)

**Your answer:** use b and c provide options
and also recommend based on your investing modules and ai
---

### 4. Data sources priority
Which data sources do you want to use first?

- [ ] Groww (portfolio, holdings, P&L)
- [ ] Screener.in (financials, ratios)
- [ ] Tickertape (financials, analysis)
- [ ] All of the above

**Your answer:** all of the above 

---

### 5. Email verification gate
How should `email_verified` gate access?

- [ ] **A**: Only verified users can access the investment section
- [ ] **B**: Verified users get full access; unverified users see limited/read-only content
- [ ] **C**: Other (describe below)

**Your answer:** A

---

### 6. Phase / MVP
Do you want to start with a small MVP or plan for the full feature set?

- [ ] **MVP**: Phase 1 – e.g. Groww portfolio sync + basic P&L only
- [ ] **Full**: Plan for everything (portfolio, reports, tips, recommendations)

**Your answer:** Full

---

## Draft Plan (to be refined based on your answers)

### Phase 1 – Foundation (if MVP)
1. **Backend**
   - New routes/controllers under `/api/v1/investments` (or `/api/v1/customer/investments`)
   - Gate by `email_verified` in the controller or middleware
   - Models: `GrowwConnection` (or similar) to store user’s Groww API credentials (encrypted)

2. **Groww integration**
   - Service to call Groww API (holdings, positions)
   - Store credentials securely (user links account after SSS BAGS login)

3. **Frontend**
   - New section: “Investments” (e.g. `/investments` or `/portfolio`)
   - Protected by `email_verified` (redirect unverified users to verify-email)
   - Pages: Portfolio overview, Holdings, P&L

### Phase 2 – Data & reports
4. **Screener / Tickertape**
   - Backend services to fetch data (API where available, scraping with caution)
   - Cache results to avoid rate limits

5. **Reports**
   - Monthly/yearly P&L reports
   - Export (e.g. PDF/CSV)

### Phase 3 – Tips & recommendations
6. **Tips and recommendations**
   - Based on your answer to Q3: display-only, AI-generated, or rule-based
   - UI for “What to buy/sell” and timing suggestions

---

## Notes

- **Legal**: Investment advice may be regulated (e.g. SEBI in India). Consider disclaimers and “not financial advice” notices.
- **Scraping**: Screener.in has no official API; scraping may violate ToS. Prefer official APIs where possible.
- **Groww API**: Requires API key approval and possibly TOTP setup per user.

---

## Your changes and answers

Use this section to add any extra requirements or notes:

_[Add your answers and changes here]_
