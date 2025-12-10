import yfinance as yf
import pandas as pd
from pymongo import MongoClient
from datetime import datetime

client = MongoClient('mongodb://localhost:27017')

db = client['positionSize']

collection = db['stocks']

df_data = pd.DataFrame()

# tickers = []
for stock in collection.find():
  # tickers.append(stock['ticker'])

  data = yf.download(tickers=stock['ticker'], period='50d', interval='1d')
  # current = yf.download(tickers=stock['ticker'], period='1m', interval='1m')

  # Reset the index to make 'Date' a regular column
  data.reset_index(inplace=True)
  # current.reset_index(inplace=True)

  df = pd.DataFrame(data).round(2)
  # df_current = pd.DataFrame(current).round(2)

  # df['Current Price'] = df_current['Close']

  df = df.rename(columns={'Ticker': 'ticker'})
  df['ticker'] = stock['ticker']


  df.columns = df.columns.droplevel(1)

  df['50D'] = df['Close'].tail(50).mean()
  df['50D'] = df['50D'].round(2)

  df['20D'] = df['Close'].tail(20).mean()
  df['20D'] = df['20D'].round(2)

  df['10D'] = df['Close'].tail(10).mean()
  df['10D'] = df['10D'].round(2)
  
  df['5D'] = df['Close'].tail(5).mean()
  df['5D'] = df['5D'].round(2)

  df['Time'] = datetime.now().strftime("%H:%M:%S")

  df = df.tail(1)

  df = df[['ticker', 'Time', 'Close', '5D', '10D', '20D', '50D']]
  df_data = pd.concat([df_data, df], ignore_index=True)

# print(df_data)
# print(df_data.to_json(orient='records'))
print(df_data.to_csv('stockData.csv'))

