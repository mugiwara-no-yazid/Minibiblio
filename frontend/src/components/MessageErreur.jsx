function MessageErreur({ message }) {
  if (!message) {
    return null;
  }

  return <p role="alert">Erreur : {message}</p>;
}

export default MessageErreur;
