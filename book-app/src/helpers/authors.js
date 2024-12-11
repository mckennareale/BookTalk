const authors = [
    'Rose Arny',
    'William Shakespeare',
    'Library of Congress. Copyright Office',
    'Agatha Christie',
    'Erle Stanley Gardner',
    'Louis L\'Amour',
    'Charles Dickens',
    'Isaac Asimov',
    'Mark Twain',
    'Edgar Rice Burroughs',
    'Rudyard Kipling',
    'Francine Pascal',
    'Various',
    'Library of Congress',
    'Zane Grey',
    'Lonely Planet',
    'Robert Louis Stevenson',
    'Ann M. Martin',
    'Carolyn Keene',
    'Henry James',
    'Nora Roberts',
    'Jane Austen',
    'Joseph Conrad',
    'Thomas Hardy',
    'Oscar Wilde',
    'Andre Norton',
    'Anthony Trollope',
    'Arthur Conan Doyle',
    'DK',
    'John Steinbeck',
    'Lewis Carroll',
    'Jules Verne',
    'Stephen King',
    'Herman Melville',
    'Bertrand Russell',
    'Georgette Heyer',
    'Arthur James Wells',
    'Edgar Allan Poe',
    'Rex Stout',
    'Franklin W. Dixon',
    'Ernest Hemingway',
    'Nathaniel Hawthorne',
    'Louisa May Alcott',
    'Washington Irving',
    'National Research Council',
    'Bernard Cornwell',
    'Jack London',
    'Jerry B. Jenkins',
    'Virginia Woolf',
    'Rand McNally',
    'C. S. Lewis',
    'Zondervan',
    'Terry Pratchett',
    'R. L. Stine',
    'Anne McCaffrey',
    'Harold Bloom',
    'Graham Greene',
    'George Eliot',
    'Henry David Thoreau',
    'William W. Johnstone',
    'R R Bowker Publishing',
    'Jack Canfield',
    'Jamie Suzanne',
    'Plato',
    'Alexandre Dumas',
    'Anonymous',
    'Leslie Charteris',
    'Joyce Carol Oates',
    'Beatrix Potter',
    'Danielle Steel',
    'Institute of Medicine',
    'Ray Bradbury',
    'Enid Blyton',
    'Anne Perry',
    'Sigmund Freud',
    'Rough Guides',
    'Thomas Merton',
    'Mark Victor Hansen',
    'Hal Leonard Publishing Corporation',
    'National Learning Corporation',
    'Kurt Vonnegut',
    'Ralph Waldo Emerson',
    'Jan Berenstain',
    'Stan Berenstain',
    'Tim LaHaye',
    'Martin Luther',
    'Gilbert Morris',
    'H. G. Wells',
    'Janette Oke',
    'Walter Scott',
    'James Fenimore Cooper',
    'George Orwell',
    'Charles Darwin',
    'Poul Anderson',
    'Piers Anthony',
    'James Patterson',
    'Kahlil Gibran',
    'Margaret Wise Brown',
    'Marion Zimmer Bradley',
    'Henry Wadsworth Longfellow',
    'Microsoft Corporation',
    'Robert Graves',
    'Robert A. Heinlein',
    'Martin Harry Greenberg',
    'Upton Sinclair',
    'Catherine Coulter',
    'Ellery Queen',
    'Bowker',
    'John MacArthur',
    'Patrick O\'Brian',
    'Dr. Seuss',
    'Francis Parkman',
    'Thomas Nelson Publishers',
    'Ellis Peters',
    'Aldous Huxley',
    'Daniel Defoe',
    'Max Lucado',
    'John Dickson Carr',
    'Catherine Cookson',
    'Georges Simenon',
    'Michael Moorcock',
    'Gilbert Keith Chesterton',
    'Hans Christian Andersen',
    'Grace Livingston Hill',
    'Tom Clancy',
    'James Baldwin',
    'Robert Silverberg',
    'John D. MacDonald',
    'Thomas Carlyle',
    'Andrew Murray',
    'Zondervan Publishing House',
    'Charles M. Schulz',
    'Penton Staff',
    'Robert Jordan',
    'Osho',
    'Time-Life Books',
    'William Makepeace Thackeray',
    'McGraw-Hill Education',
    'Alan Dean Foster',
    'Edith Wharton',
    'Hal Leonard Corp.',
    'Diana Palmer',
    'American Bar Association. House of Delegates',
    'Pimsleur',
    'Insight Guides',
    'Winston Churchill',
    'Jean-Paul Sartre',
    'Center for Professional Responsibility (American Bar Association)',
    'Random House',
    'John Updike',
    'Who HQ',
    'John Buchan',
    'Solomon Northup',
    'HardPress',
    'Charles R. Swindoll',
    'James Joyce',
    'Phyllis Reynolds Naylor',
    'Oxford University Press',
    'Don Pendleton',
    'Let\'s Go Inc.',
    'Princeton Review',
    'John Bunyan',
    'Max Brand',
    'Pelham Grenville Wodehouse',
    'Mercer Mayer',
    'John Piper',
    'Jane Yolen',
    'Martin Gardner',
    'Rudolf Steiner',
    'Noam Chomsky',
    'Stan Lee',
    'R.R. Bowker Company. Department of Bibliography',
    'Frances Hodgson Burnett',
    'Robert Ludlum',
    'Bernard Shaw',
    'William Faulkner',
    'Mary Stewart',
    'Lucy Maud Montgomery',
    'Warren W. Wiersbe',
    'Philip José Farmer',
    'Karl Marx',
    'Jack Vance',
    'R.L. Stine',
    'Tom Tierney',
    'George Alfred Henty',
    'Ngaio Marsh',
    'Orson Scott Card',
    'Evelyn Waugh',
    'Willa Cather',
    'Princeton Review (Firm)',
    'C. S. Forester',
    'Elizabeth George',
    'Alan Watts',
    'Dante Alighieri',
    'Cynthia Rylant',
    'P. G. Wodehouse',
    'Theodore Roosevelt',
    'Hergé',
    'William Blake',
    'Homer',
    'Alan Alexander Milne',
    'Wilkie Collins',
    'Philip K. Dick',
    'Henry Miller',
    'Roger Zelazny',
    'Ruth Rendell',
    'Matt Christopher',
    'G. K. Chesterton',
    'Anne Rice',
    'John Haynes',
    'Friedrich Nietzsche',
    'Jwing-Ming Yang',
    'Gardner Dozois',
    'David Herbert Lawrence',
    'Ellen Gould Harmon White',
    'Harry Turtledove',
    'John Norman',
    'Irving Stone',
    'John Henry Newman',
    'Langston Hughes',
    'Watchman Nee',
    'James Axler',
    'Kevin J. Anderson',
    'Larry McMurtry',
    'Thomas Nelson',
    'Richard Scarry',
    'D. H. Lawrence',
    'Better Homes and Gardens',
    'Kaplan',
    'Neil Gaiman',
    'Cambridge University Press',
    'C. J. Cherryh',
    'Harry Harrison',
    'O. Henry',
    'Miss Read',
    'William Wordsworth',
    'Arthur Charles Clarke',
    'General Press',
    'Terrance Dicks',
    'Geoffrey Chaucer',
    'V.C. Andrews',
    'Jean Plaidy',
    'Division of Behavioral and Social Sciences and Education',
    'Maeve Binchy',
    'Voltaire',
    'Margaret Weis',
    'Fyodor Dostoevsky',
    'R. Reginald',
    'Henrik Ibsen',
    'William Morris'
];

export default authors;
