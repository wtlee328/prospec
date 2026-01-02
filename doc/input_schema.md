Leads Finder Input Schema This document outlines the input parameters for the
Leads Finder Actor.[1] These settings allow you to filter leads by person,
company, location, and revenue data.[1]

- ⚙️ General Settings Field	Type	Default	Description
  fetch_count	integer	50000	The maximum number of leads to scrape. Leave empty
  to scrape all leads matching your criteria. file_name	string	"Prospects"	A
  custom name or label for the dataset file to easily recognize it in your run
  history.
- 👤 Contact Filters Field	Type	Description contact_job_title	array	List of job
  titles to include (e.g., "realtor", "software developer", "teacher").
  contact_not_job_title	array	List of job titles to exclude.
  seniority_level	array	Filter by seniority (e.g., Owner, Partner, CXO, VP,
  Director, Manager, Senior, Entry, Unpaid). functional_level	array	Filter by
  job function/department (e.g., Engineering, Sales, Marketing, HR, Finance).[1]
  email_status	array	Filter by the validity of email addresses (e.g.,
  "Verified", "Guessed").
- 🌍 Location Filters Field	Type	Description contact_location	array	Select one
  or more regions, countries, or states to include. contact_city	array	Specify
  one or more cities to include. contact_not_location	array	Select one or more
  regions, countries, or states to exclude. contact_not_city	array	Specify one
  or more cities to exclude.
- 🏢 Company Filters Field	Type	Description company_domain	array	specific
  company domains to include (e.g., google.com, apple.com).
  company_industry	array	List of industries to include (e.g., "Computer
  Software", "Real Estate"). company_not_industry	array	List of industries to
  exclude. company_keywords	array	Keywords to include based on company
  description (e.g., "restaurant", "fitness", "saas").
  company_not_keywords	array	Keywords to exclude from company descriptions.
  size	array	Filter by company employee count (e.g., "1-10", "11-50", "1000+").
  funding	array	Filter by funding rounds (e.g., "Seed", "Series A", "IPO").
- 💰 Revenue Filters Field	Type	Options	Description min_revenue	enum	100K, 500K,
  1M, 5M, 10M, 25M, 50M, 100M, 500M, 1B, 5B, 10B	The minimum annual revenue of
  the company. max_revenue	enum	100K, 500K, 1M, 5M, 10M, 25M, 50M, 100M, 500M,
  1B, 5B, 10B	The maximum annual revenue of the company.

Input JSON example { "fetch_count": 50000, "file_name": "Prospects",
"email_status": [ "validated" ] }
