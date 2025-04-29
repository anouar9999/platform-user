import * as Yup from 'yup';

// Define validation schemas for each step
export const teamIdentitySchema = Yup.object().shape({
  name: Yup.string()
    .required('Team name is required')
    .max(255, 'Team name must be less than 255 characters'),
  tag: Yup.string()
    .required('Team tag is required')
    .max(10, 'Team tag must be less than 10 characters'),
  description: Yup.string()
    .max(1000, 'Description must be less than 1000 characters')
});

export const teamBrandingSchema = Yup.object().shape({
  logo: Yup.mixed()
    .test(
      'fileSize',
      'Logo must be less than 2MB',
      value => !value || (value && value.length * 0.75 <= 2 * 1024 * 1024)
    ),
  banner: Yup.mixed()
    .test(
      'fileSize',
      'Banner must be less than 2MB',
      value => !value || (value && value.length * 0.75 <= 2 * 1024 * 1024)
    )
});

export const gameSelectionSchema = Yup.object().shape({
  game_id: Yup.number()
    .required('Please select a game')
    .min(1, 'Please select a game'),
  division: Yup.string()
    .required('Division is required'),
  tier: Yup.string()
    .required('Team tier is required')
});

export const contactInfoSchema = Yup.object().shape({
  discord: Yup.string()
    .url('Please enter a valid Discord URL')
    .nullable(),
  twitter: Yup.string()
    .matches(/^@?(\w){1,15}$/, 'Please enter a valid Twitter/X handle')
    .nullable()
    .transform(value => (!value ? null : value)),
  contact_email: Yup.string()
    .email('Please enter a valid email address')
    .nullable()
    .transform(value => (!value ? null : value))
});

// Map steps to their respective schemas
export const getValidationSchemaForStep = (step) => {
  switch(step) {
    case 1:
      return teamIdentitySchema;
    case 2:
      return teamBrandingSchema;
    case 3:
      return gameSelectionSchema;
    case 4:
      return contactInfoSchema;
    default:
      return Yup.object();
  }
};