import pandas as pd
import string

books = pd.read_csv("/Users/mckennareale/Downloads/550_project/data/amazon/books_data.csv")
ratings = pd.read_csv("/Users/mckennareale/Downloads/550_project/data/amazon/Books_rating.csv")
ratings = ratings[['Title', 'Id']].drop_duplicates()

# data cleaning
bm = books.merge(ratings[['Title', 'Id']], on='Title', how='left')
bm['publishedDate'] = bm['publishedDate'].str[:4]
bm['category_list'] = bm['categories'].str.split(', ')
bm['authors_list'] = bm['authors'].str.split(', ')

# extract a list of unique categories
bm['first_category'] = bm['category_list'].apply(lambda x: x[0] if isinstance(x, list) else None)
bm['first_category'] = bm['first_category'].str.strip("[]").str.replace("'", "")
bm['first_category'] = bm['first_category'].str.title()
bm['first_category'] = bm['first_category'].str.rstrip(string.punctuation)
unique_categories = bm['first_category'].dropna().unique()
with open('/Users/mckennareale/Downloads/550_project/data/unique_categories.txt', 'w') as file:
    for category in unique_categories:
        file.write(f"{category}\n")
bm.to_csv("/Users/mckennareale/Downloads/550_project/data/books_w_id.csv")

# mapping table of author to book ID (accounts for >1 author/book)
authors_mapping = bm.explode('authors').reset_index(drop=True)
cols = ['Title', 'Id', 'authors']
authors_mapping = authors_mapping[cols]