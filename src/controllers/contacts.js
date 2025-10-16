// src/controllers/contacts.js
import {
  createContact,
  deleteContact,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import * as contactsService from '../services/contacts.js';
import { SessionsCollection } from '../db/models/session.js';
import { ContactsCollection } from '../db/models/contacts.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await contactsService.getAllContacts({
    userId: req.user._id,
    page: Number(page),
    perPage: Number(perPage),
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact with',
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  const { email } = req.body;

  try {
    if (email) {
      const existingContact = await ContactsCollection.findOne({
        email,
        userId,
      });
      if (existingContact) {
        throw createHttpError(409, 'Email in use');
      }
    }

    const contact = await createContact(req.body, userId);

    if (!contact) {
      throw createHttpError(400, 'Failed to create contact');
    }

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (err) {
    if (err.code === 11000) {
      throw createHttpError(409, 'Email in use');
    }
    throw err;
  }
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await deleteContact(contactId, userId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await updateContact(contactId, req.body, userId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const logoutUserController = async (req, res) => {
  const userId = req.user._id;

  await SessionsCollection.deleteOne({ userId });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged out!',
    data: null,
  });
};
