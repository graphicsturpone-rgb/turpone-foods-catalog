import { Block } from 'payload';

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
    },
    {
      name: 'subheadline',
      type: 'textarea',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Button Text',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Button Link',
    },
    {
      name: 'design',
      type: 'group',
      fields: [
        {
          name: 'padding',
          type: 'text',
          defaultValue: 'py-20',
        },
        {
          name: 'alignment',
          type: 'select',
          options: ['left', 'center', 'right'],
          defaultValue: 'center',
        }
      ]
    }
  ],
};
