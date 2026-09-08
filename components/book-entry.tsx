import type { Book } from '@/lib/work-types';

export function BookEntry({ book, english = false }: { book: Book; english?: boolean }) {
  return <article className="publication-entry" id={`work-${book.id}`}>
    <p className="work-meta"><span>{book.year}</span><span>{english ? 'Book' : '著書'}</span></p>
    <h3>{book.url ? <a href={book.url}>{book.title} ↗</a> : book.title}</h3>
    <p className="publication-authors">{book.authors.map((author,i) => <span key={`${author}-${i}`}>{i > 0 && ', '}{['Kensuke Suga','須賀 健介'].includes(author) ? <strong>{author}</strong> : author}</span>)}</p>
    {book.contribution && <p className="publication-citation">{english ? 'Contribution: ' : '担当：'}{book.contribution}</p>}
    <p className="publication-citation">{book.publisher}{book.pages && `, pp. ${book.pages}`} ({book.year}).</p>
    {book.isbn && <p className="publication-citation">ISBN: {book.isbn}</p>}
  </article>;
}
