# Required and optional documents per guided flow

Generated from the code. **Required** documents are asked first, one at a time. **Optional** documents are offered together before the reconciliation runs, and again below the result. A ✱ marks documents that can be fetched from the GST Portal as well as uploaded.

Summary: **recovery** = money coming back, **exposure** = tax unpaid or under-reported, **mismatch** = differences between books and returns.

## Outward Supply & GST Liability Reconciliation

| Flow | Required | Optional | Summary |
|---|---|---|---|
| Sales Register vs GSTR-1 | Sales Revenue Register; GSTR-1 ✱ | GSTR-1A ✱; Sales Credit Debit Notes; GSTR-3B Liability Summary ✱ | recovery |
| Advances Received vs GST Liability | Advance Register; GSTR-1 ✱ | Sales Revenue Register; GSTR-3B Liability Summary ✱ | exposure |
| HSN/SAC Summary vs Sales Register | Sales Revenue Register; GSTR-1 HSN Summary ✱ | HSN/SAC Master; Sales Credit Debit Notes | mismatch |
| Exports / SEZ with LUT vs GSTR-1 | Sales Revenue Register; GSTR-1 ✱ | Export / SEZ Register; LUT Details; Shipping Bill Data | mismatch |
| Exports / SEZ with IGST Payment vs GSTR-1 / GSTR-3B | Sales Revenue Register; GSTR-1 ✱; GSTR-3B ✱ | Export / SEZ Register; Shipping Bill Data; Refund Eligibility Working | recovery |

## E-Invoice / E-Way Bill Reconciliation

| Flow | Required | Optional | Summary |
|---|---|---|---|
| Sales Register vs e-Invoice vs GSTR-1 | Sales Revenue Register; e-Invoice (IRP) Register ✱; GSTR-1 ✱ | Sales Credit Debit Notes | mismatch |

## GSTR-9C Annual Reconciliation

| Flow | Required | Optional | Summary |
|---|---|---|---|
| Books Turnover vs GSTR-9 | Sales Revenue Register; GSTR-9 Annual Return ✱ | Annual Financial Statements; Trial Balance; Credit Debit Notes | exposure |
| Final GSTR-9C Consolidated Reconciliation | GSTR-9 Annual Return ✱; Annual Financial Statements | Trial Balance | exposure |
| Financial Statements vs GSTR-9 | GSTR-9 Annual Return ✱; Annual Financial Statements | Trial Balance; GSTIN Wise Allocation | mismatch |
| Taxable Turnover Reconciliation - Table 7/8 | GSTR-9 Annual Return ✱; Sales Revenue Register | Export SEZ Register; Exempt Nil Non-GST Register; RCM Liability Working; Credit Debit Notes | mismatch |
| Rate-wise Tax Liability Reconciliation - Table 9/10 | Sales Revenue Register; GSTR-9 Annual Return ✱ | GSTR-1 GSTR-1A Annual ✱; GSTR-3B Filing ✱; RCM Liability Working | exposure |
| Additional Tax Payable / Unpaid - Table 11 | GSTR-9 Annual Return ✱; Electronic Liability Ledger ✱ | Electronic Cash Ledger ✱; DRC-03 Additional Payments | exposure |
| Books ITC vs GSTR-9 - Table 12/13 | GSTR-9 Annual Return ✱; Input GST GL | Trial Balance; ITC Claim Working; ITC Reversal Reclaim; Prior Next Year Timing; GSTIN Wise Allocation | mismatch |
| Expense-head ITC Reconciliation - Table 14 | Expense Head ITC Working; Trial Balance | Input GST GL; Vendor Bill Register | mismatch |
| GSTR-2B vs Purchase/Expense ITC vs GSTR-9 | GSTR-2B Detail ✱; Vendor Bill Register | Input GST GL; GSTR-9 Annual Return ✱; ITC Claim Working | mismatch |
| Prior-Year / Next-Year ITC Timing Reconciliation | Prior Next Year Timing; Input GST GL | ITC Claim Working; GSTR-9 Annual Return ✱ | mismatch |
| RCM Annual Liability & ITC Reconciliation | RCM Liability Working; GSTR-3B Filing ✱ | GSTR-9 Annual Return ✱; Input GST GL; ITC Claim Working | exposure |
| DRC-03 / Additional Payment Reconciliation | DRC-03 Additional Payments; Electronic Liability Ledger ✱ | Electronic Cash Ledger ✱; GSTR-9 Annual Return ✱ | exposure |
| GSTR-3B vs GSTR-9 | GSTR-3B Filing ✱; GSTR-9 Annual Return ✱ | — | mismatch |
| Books Turnover vs GSTR-1 / GSTR-1A | Sales Revenue Register; GSTR-1 / GSTR-1A ✱ | Trial Balance; Credit Debit Notes | mismatch |
| GSTR-1 / GSTR-1A vs GSTR-3B | GSTR-1 / GSTR-1A ✱; GSTR-3B Filing ✱ | — | exposure |
| Next-Year Reported Transactions | Next-Year Reported Items Register; GSTR-9 Annual Return ✱ | Prior Next Year Timing; Credit Debit Notes; ITC Claim Working | exposure |
| Section 34 Credit Notes - Time Limit & ITC Reversal | Sales Credit Debit Notes; GSTR-1 ✱ | Credit Debit Notes; ITC Reversal Reclaim | exposure |
| Prior-Year Items Reported This Year | Prior Next Year Timing; GSTR-9 Annual Return ✱ | Sales Revenue Register; Input GST GL | mismatch |

## ITC Availability ↔ ITC Claim

| Flow | Required | Optional | Summary |
|---|---|---|---|
| Excess ITC Claim Reconciliation | ITC Claim Working; GSTR-2B Detail ✱ | GSTR-3B Filing ✱ | exposure |
| GSTR-2B vs GSTR-3B | GSTR-2B Detail ✱; GSTR-3B Filing ✱ | ITC Claim Working; IMS Detail ✱ | recovery |
| 2B vs Claim Working vs GSTR-3B Consolidated | GSTR-2B Detail ✱; ITC Claim Working | GSTR-3B Filing ✱ | recovery |
| ITC Claim Working vs GSTR-3B | ITC Claim Working; GSTR-3B Filing ✱ | — | mismatch |
| Deferred / Unclaimed ITC Reconciliation | GSTR-2B Detail ✱; ITC Claim Working | — | recovery |

## Purchase Invoice ↔ GST Portal

| Flow | Required | Optional | Summary |
|---|---|---|---|
| Supplier GSTIN Reconciliation | Vendor Bill Register; GSTR-2A Detail ✱ | GSTR-2B Detail ✱ | mismatch |
| Taxable Value Reconciliation | Vendor Bill Register; GSTR-2A Detail ✱ | GSTR-2B Detail ✱ | mismatch |
| Bill vs 2A vs 2B Consolidated | Vendor Bill Register; GSTR-2A Detail ✱ | GSTR-2B Detail ✱ | recovery |
| Bill vs GSTR-2A | Vendor Bill Register; GSTR-2A Detail ✱ | — | recovery |
| Bill vs GSTR-2B | Vendor Bill Register; GSTR-2B Detail ✱ | GSTR-2A Detail ✱ | recovery |

## Invoice Management System (IMS) Reconciliation

| Flow | Required | Optional | Summary |
|---|---|---|---|
| IMS vs 2B vs ITC Claim Consolidated | IMS Detail ✱; GSTR-2B Detail ✱ | ITC Claim Working; Vendor Bill Register | recovery |
| IMS vs GSTR-2B | IMS Detail ✱; GSTR-2B Detail ✱ | — | mismatch |

## Book GST ↔ Accounting GL

| Flow | Required | Optional | Summary |
|---|---|---|---|
| Input GST GL vs GSTR-2B | Input GST GL; GSTR-2B Detail ✱ | Vendor Bill Register | mismatch |
| GST Tax-Head Reconciliation | Vendor Bill Register; Input GST GL | — | mismatch |

## Filed Return ↔ GST Portal Credit Ledger

| Flow | Required | Optional | Summary |
|---|---|---|---|
| GST Receivable GL vs Electronic Credit Ledger Bridge | Input GST GL; Electronic Credit Ledger ✱ | GSTR-2B Detail ✱; ITC Claim Working | mismatch |
| GSTR-3B vs Electronic Credit Ledger | GSTR-3B Filing ✱; Electronic Credit Ledger ✱ | — | mismatch |

## Advanced ITC Eligibility / Reversal Reconciliation

| Flow | Required | Optional | Summary |
|---|---|---|---|
| Blocked ITC Reconciliation | ITC Eligibility Register; GSTR-2B Detail ✱ | ITC Claim Working | exposure |
| Common Credit Reversal | Common Credit Rule 42/43 Working; Input GST GL | ITC Reversal Reclaim | exposure |
| Time-barred ITC Reconciliation | ITC Eligibility Register; GSTR-2B Detail ✱ | — | exposure |
| Temporary Reversal vs Reclaim | ITC Reversal Reclaim; ITC Eligibility Register | ITC Claim Working | recovery |
| Supplier Credit Note ITC Reversal | Credit Debit Notes; IMS Detail ✱ | ITC Reversal Reclaim; ITC Claim Working | exposure |
| Capital Goods ITC vs Fixed Asset Register | Fixed Asset Register; ITC Claim Working | GSTR-2B Detail ✱; Input GST GL | mismatch |
| Unpaid Supplier ITC Reversal (180 days) | Vendor Bill Register; Supplier Payment Condition Working | Vendor Ledger Statement; Bank Statement; ITC Reversal Reclaim; Rule-37A Compliance Working | exposure |

## ITC Reversal ↔ Reclaim

| Flow | Required | Optional | Summary |
|---|---|---|---|
| Reversal/Reclaim vs Electronic Credit Ledger | ITC Reversal Reclaim; Electronic Credit Ledger ✱ | GSTR-3B Filing ✱ | mismatch |

## Reverse Charge (RCM) Reconciliation

| Flow | Required | Optional | Summary |
|---|---|---|---|
| RCM ITC Working vs GSTR-3B | RCM Liability Working; ITC Claim Working | GSTR-3B Filing ✱ | exposure |
| RCM Liability vs GSTR-3B | RCM Liability Working; GSTR-3B Filing ✱ | — | exposure |
| RCM Bills vs RCM Liability Working | Vendor Bill Register; RCM Liability Working | — | exposure |
| RCM Bill vs GL vs Claim Consolidated | Vendor Bill Register; RCM Liability Working | Input GST GL; ITC Claim Working; GSTR-3B Filing ✱ | exposure |

## Import / SEZ / ICEGATE ITC Reconciliation

| Flow | Required | Optional | Summary |
|---|---|---|---|
| Bill of Entry vs GSTR-2B | Bill of Entry Register; GSTR-2B Detail ✱ | — | mismatch |
| ICEGATE vs GSTR-2B | ICEGATE Import Data; GSTR-2B Detail ✱ | — | mismatch |
| Import ITC vs GSTR-3B | ITC Claim Working; GSTR-3B Filing ✱ | — | mismatch |
| Import ITC Consolidated Reconciliation | Import Purchase Register; Bill of Entry Register | ICEGATE Import Data; GSTR-2B Detail ✱; Input GST GL; ITC Claim Working; GSTR-3B Filing ✱ | mismatch |

## ISD / Common ITC Distribution Reconciliation

| Flow | Required | Optional | Summary |
|---|---|---|---|
| GSTR-6 Distribution vs Recipient GSTR-2B | GSTR-6 ISD Return ✱; GSTR-2B Detail ✱ | — | mismatch |
| Distributed ITC vs GSTR-3B | ISD Credit Distribution Register; ITC Claim Working | GSTR-3B Filing ✱ | mismatch |
| ISD Purchase ITC vs GSTR-6 | ISD Credit Distribution Register; GSTR-6 ISD Return ✱ | — | mismatch |
| ISD Consolidated Reconciliation | GSTR-6 ISD Return ✱; ISD Credit Distribution Register | GSTR-2B Detail ✱; Input GST GL; ITC Claim Working; GSTR-3B Filing ✱ | mismatch |

## GST Return Compliance / DRC Controls

| Flow | Required | Optional | Summary |
|---|---|---|---|
| DRC-01B Difference vs Explanation / DRC-03 | DRC-01B Return Compliance ✱; DRC Response Register | DRC-03 Additional Payments | exposure |
| GSTR-1 Liability vs GSTR-3B - DRC-01B Control | GSTR-1 ✱; GSTR-3B Filing ✱ | DRC-01B Return Compliance ✱; System Generated GSTR-3B Summary | exposure |
| Demands & Orders Raised vs Paid | Demand & Order Register; Electronic Liability Ledger ✱ | Electronic Cash Ledger ✱; GST Payment Challan Register; DRC Response Register | exposure |

## GST Liability & Tax Payment Reconciliation

| Flow | Required | Optional | Summary |
|---|---|---|---|
| Liability Ledger vs Cash + Credit Utilisation | Electronic Liability Ledger ✱; Electronic Cash Ledger ✱ | Electronic Credit Ledger ✱ | mismatch |
| GSTR-3B vs Electronic Cash Ledger | GSTR-3B Filing ✱; Electronic Cash Ledger ✱ | GST Payment Challan Register | mismatch |
| GSTR-3B vs Electronic Liability Ledger | GSTR-3B Filing ✱; Electronic Liability Ledger ✱ | — | mismatch |
| DRC-03 vs Additional Liability | DRC-03 Additional Payments; Electronic Liability Ledger ✱ | — | exposure |
| Interest / Late Fee Reconciliation | Electronic Liability Ledger ✱; Electronic Cash Ledger ✱ | GST Payment Challan Register | exposure |
| Tax Payable vs Tax Paid Consolidated | GSTR-3B Filing ✱; Electronic Liability Ledger ✱ | Electronic Cash Ledger ✱; Electronic Credit Ledger ✱ | exposure |

## GST Refund Reconciliation & Recovery

| Flow | Required | Optional | Summary |
|---|---|---|---|
| Pending GST Refund Ageing | RFD-01 Refund Applications ✱; RFD-06 Refund Orders ✱ | Refund Bank Receipts | recovery |
| Refund Sanctioned vs Bank Receipt | RFD-06 Refund Orders ✱; Refund Bank Receipts | — | recovery |
| RFD-01 vs RFD-06 Sanction | RFD-01 Refund Applications ✱; RFD-06 Refund Orders ✱ | — | recovery |
| RFD-01 Claim vs Eligible Amount | RFD-01 Refund Applications ✱; Refund Eligibility Working | — | recovery |
| Export / SEZ Refund Eligibility | Refund Eligibility Working; Export SEZ Register | GSTR-3B Filing ✱; ITC Claim Working | recovery |

