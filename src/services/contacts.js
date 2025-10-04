// src/services/contacts.js
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  try {
    const contactsQuery = ContactsCollection.find(filter);
    const contactsCount = await ContactsCollection.find(filter)
      .merge(contactsQuery)
      .countDocuments();

    const contacts = await contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec();

    const paginationData = calculatePaginationData(
      contactsCount,
      perPage,
      page,
    );

    return {
      data: contacts,
      ...paginationData,
    };
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

export const createContact = async (payload) => {
  try {
    const contact = await ContactsCollection.create(payload);
    return contact;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteContact = async (contactId) => {
  try {
    const contact = await ContactsCollection.findOneAndDelete({
      _id: contactId,
    });
    return contact;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateContact = async (contactId, payload, options = {}) => {
  const updContact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    {
      new: true,
      ...options,
    },
  );

  return updContact;
};
