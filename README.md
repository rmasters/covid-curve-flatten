# Who's flattening the curve?

A one-pager of each country's cases time-series chart.

## Try it locally

1.  `npm install`
2.  `python3 curve.py > cases.json`
3.  `webpack-dev-server`
4.  [localhost:8081](http://localhost:8081/)

## Todo list

*   [x] UI
*   [x] Cases data
*   [ ] Deployment (kube)
*   [ ] Find or aggregate data for critical/intensive/acute care beds and ventilators per country
    *   [WHO has data, but it's old and Europe-only](https://gateway.euro.who.int/en/indicators/hfa_478-5060-acute-care-hospital-beds-per-100-000/)
    *   [Wikipedia has data, but it's old and limited](https://en.wikipedia.org/wiki/List_of_countries_by_hospital_beds)
    *   Individual healthcare associations public reports on capacity (e.g. [NHS England](https://www.england.nhs.uk/statistics/statistical-work-areas/critical-care-capacity/critical-care-bed-capacity-and-urgent-operations-cancelled-2019-20-data/))
