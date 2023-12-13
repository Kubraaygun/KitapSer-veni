import { useState } from "react";
import Header from "./components/Header/Header";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import BookCard from "./components/BookCard/BookCard";
import DeleteModal from "./components/DeleteModal/DeleteModal";
import EditModal from "./components/EditModal/EditModal";

function App() {
  //Yeni kitabin adinin tutuldugu state
  const [bookName, setBookName] = useState("");
  //tum kitap verilerinin tutuldugu state
  const [books, setBooks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [editItem, setEditItem] = useState({});

  //inputun icerigini almak icin fonksiyon
  //input her degistiginde calisir
  const handleChange = (e) => {
    //console.log(e.target.value)
    setBookName(e.target.value);
  };

  //kitap ekleme fonksiyonu
  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log('form')

    //Eger kitap ismi yoksa-input bossa ;
    if (!bookName) {
      //mesaj gosterme islevi
      toast.warn("Lütfen Kitap İsmi Giriniz", { autoClose: 2000 });
      //fonksiyonun asagiya devam etmesini engellemek icin;
      return;
    }

    //yeni kitap olusturma objesi;
    const newBook = {
      id: v4(),
      title: bookName,
      date: new Date().toLocaleString(),
      isRead: false,
    };

    // console.log('yeni kitap projesi', newBook)

    //spread operator(...) yardimi ile state icinde bulunan tum kitaplari dizi icine aktardim daha sonra
    //ustune yeni olusturdugum kitabi ekledim.

    setBooks([...books, newBook]);

    toast("Kitap Başarıyla Eklendi", { autoClose: 2000 });

    setBookName("");
  };

  const handleModal = (deleteBookId, deleteBookTitle) => {
    setDeleteId(deleteBookId);
    setDeleteTitle(deleteBookTitle);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    const filteredBooks = books.filter((book) => book.id !== deleteId);
    //console.log(filteredBooks)

    setBooks(filteredBooks);
    setShowDeleteModal(false);
    

    toast.error("Kitap Başarıyla Silindi", { autoClose: 2000 });
  };

  const handleEditModal = (editBook) => {
    // console.log('duzenleme modali')
    setEditItem(editBook);

    setShowEditModal(true);
  };

  const handleEditBook = () => {
    const editIndex = books.findIndex((book) => book.id === editItem.id);

    const cloneBooks = [...books];

    cloneBooks.splice(editIndex, 1, editItem);
    setBooks(cloneBooks);
    setShowEditModal(false);
    toast.success("Kitap Başarıyla Güncellendi", { autoClose: 2000 });
  };

  //Kitabi okundu olarak isaretleme

  const handleRead = (readBook) => {
    const updatedBook = { ...readBook, isRead: !readBook.isRead };

    const index = books.findIndex((book) => book.id === readBook.id);

    const cloneBooks = [...books];
    cloneBooks[index] = updatedBook;
    setBooks(cloneBooks);
  };

  return (
    <div>
      <Header />

      <div className="container">
        <form className="d-flex gap-3 mt-4" onSubmit={handleSubmit}>
          <input
            value={bookName}
            onChange={handleChange}
            placeholder="Bir Kitap İsmi Giriniz"
            className="form-control shadow"
            type="text"
          />
          <button className="btn btn-warning shadow ">Ekle</button>
        </form>
        {/* Eğer kitap dizim boş ise */}
        {books.length === 0 ? (
          <h4>Henüz Herhangi Bir Kitap Eklenmedi</h4>
        ) : (
          //Kitap dizimde eleman varsa
          books.map((book) => (
            <BookCard
              handleEditModal={handleEditModal}
              handleModal={handleModal}
              bookInfo={book}
              key={book.id}
              handleRead={handleRead}
            />
          ))
        )}
      </div>
      {showDeleteModal && (
        <DeleteModal
          bookTitle={deleteTitle}
          handleDelete={handleDelete}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}

      {showEditModal && (
        <EditModal
          handleEditBook={handleEditBook}
          editItem={editItem}
          setEditItem={setEditItem}
          setShowEditModal={setShowEditModal}
        />
      )}
    </div>
  );
}

export default App;
