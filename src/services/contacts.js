// src/services/contacts.js
import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  try {
    const contacts = await ContactsCollection.find();
    return contacts;
  } catch (error) {
    console.log(error);
  }
};

export const getContactById = async (contactId) => {
  try {
    const contact = await ContactsCollection.findById(contactId);
    return contact;
  } catch (error) {
    console.log(error);
    return null;
  }
};
