function MessageErreur({ message }) {
  if (!message) {
    return null;
  }

  return <p role="alert" className="error">Erreur : {message}</p>;
}

export default MessageErreur;
