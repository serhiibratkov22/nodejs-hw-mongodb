// src/services/contacts.js
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  try {
    const query = { ...filter, userId };

    const contactsCount = await ContactsCollection.countDocuments(query);

    const contacts = await ContactsCollection.find(query)
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
    throw error;
  }
};

export const getContactById = async (contactId, userId) => {
  try {
    const contact = await ContactsCollection.findOne({
      _id: contactId,
      userId,
    });
    return contact;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createContact = async (payload, userId) => {
  try {
    const contact = await ContactsCollection.create({ ...payload, userId });
    return contact;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteContact = async (contactId, userId) => {
  try {
    const contact = await ContactsCollection.findOneAndDelete({
      _id: contactId,
      userId,
    });
    return contact;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateContact = async (
  contactId,
  payload,
  userId,
  options = {},
) => {
  const updContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      ...options,
    },
  );

  return updContact;
};
