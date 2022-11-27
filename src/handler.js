const { nanoid } = require("nanoid");
const books = require("./books");

const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  // eslint-disable-next-line no-prototype-builtins
  const cekName = request.payload.hasOwnProperty("name");

  if (!cekName) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  const newBooks = {
    // eslint-disable-next-line max-len
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    id,
    insertedAt,
    updatedAt,
  };

  if (pageCount >= readPage) {
    books.push(newBooks);
  }

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  let responseBody;
  const { query } = request;
  const { name, reading, selesai } = query;

  if (name) {
    const array = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < books.length; i++) {
      if (books[i].name.toLowerCase().includes(name.toLowerCase())) {
        // eslint-disable-next-line no-shadow
        const {
          id,
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          finished,
          reading,
        } = books[i];
        array.push({
          id,
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          finished,
          reading,
        });
      }
    }
    responseBody = {
      status: "success",
      data: {
        books: array,
      },
    };
    return responseBody;
  }

  // eslint-disable-next-line no-mixed-operators
  if ((reading && Number(reading) === 0) || Number(reading) === 1) {
    const array = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < books.length; i++) {
      // eslint-disable-next-line eqeqeq
      if (books[i].reading == reading) {
        // eslint-disable-next-line no-shadow
        const { id, name, publisher } = books[i];
        array.push({
          id,
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          finished,
          reading,
        });
      }
    }
    responseBody = {
      status: "success",
      data: {
        books: array,
      },
    };
    return responseBody;
  }

  // eslint-disable-next-line no-mixed-operators
  if ((selesai && Number(selesai) === 0) || Number(selesai) === 1) {
    const array = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < books.length; i++) {
      // eslint-disable-next-line eqeqeq
      if (books[i].selesai == selesai) {
        // eslint-disable-next-line no-shadow
        const { id, name, publisher } = books[i];
        array.push({ id, name, publisher });
      }
    }
    responseBody = {
      status: "success",
      data: {
        books: array,
      },
    };
    return responseBody;
  }
  if (selesai && Number(selesai) !== 0 && Number(selesai) !== 1) {
    const array = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < books.length; i++) {
      array.push({
        id: books[i].id,
        name: books[i].name,
        publisher: books[i].publisher,
      });
    }
    responseBody = {
      status: "success",
      data: {
        books: array,
      },
    };
    return responseBody;
  }

  if (books.length > 0 && !name && !reading && !selesai) {
    const array = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < books.length; i++) {
      array.push({
        id: books[i].id,
        name: books[i].name,
        publisher: books[i].publisher,
        year: books[i].year,
        author: books[i].author,
        summary: books[i].summary,
        pageCount: books[i].pageCount,
        readPage: books[i].readPage,
        finished: books[i].finished,
        reading: books[i].reading,
      });
    }
    responseBody = {
      status: "success",
      data: {
        books: array,
      },
    };
    return responseBody;
  }
  responseBody = {
    status: "success",
    data: {
      books,
    },
  };
  return responseBody;
};

const getBooksByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

// eslint-disable-next-line consistent-return
const editBooksByIdHandler = (request, h) => {
  // eslint-disable-next-line no-prototype-builtins
  const cekNameProperty = request.payload.hasOwnProperty("name");
  const { readPage, pageCount } = request.payload;
  const cekReadPage = readPage <= pageCount;

  if (!cekNameProperty) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }
  if (!cekReadPage) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }
  if (cekNameProperty && cekReadPage) {
    const { id } = request.params;
    const {
      // eslint-disable-next-line no-shadow
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      };

      const response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui",
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }
};

const deleteBooksByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  // eslint-disable-next-line max-len
  addBooksHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
};
