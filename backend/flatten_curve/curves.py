import datetime
import io
import re
from typing import Dict

import pandas as pd
import requests
import requests_cache


def date_fixer(date: str) -> datetime.date:
    """Reformats hard-to-use %m/%d/%y (with single digit days/months) to %Y/%m/%d"""
    m = re.match('^(?P<month>\d{1,2})/(?P<day>\d{1,2})/(?P<year>\d{2})$', date)
    if not m:
        return date

    return datetime.date(int('20' + m.group('year')), int(m.group('month')), int(m.group('day')))


def get_time_series_data() -> pd.DataFrame:
    url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
    resp = requests.get(url)
    csv_data = resp.content

    df = pd.read_csv(io.StringIO(csv_data.decode('utf-8')))

    # Group by country
    df = df.groupby(['Country/Region']).sum()

    # Convert date columns to DateTimeIndex
    df.columns = [date_fixer(column) for column in df.columns.tolist()]
    del df['Lat']
    del df['Long']

    return df


def get_critical_care_beds_data():
    url = "https://dw.euro.who.int/api/v3/export/download/1ae5608724ab40fbab3804a3b8b5f863"

