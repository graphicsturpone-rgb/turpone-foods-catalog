import { Block } from 'payload';

export const ProductGridBlock: Block = {
  slug: 'productGrid',
  labels: {
    singular: 'Product Grid',
    plural: 'Product Grids',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
    },
    {
      name: 'selectionMode',
      type: 'select',
      options: [
        { label: 'Manual Selection', value: 'manual' },
        { label: 'By Collection', value: 'collection' },
        { label: 'By Category', value: 'category' }
      ],
      defaultValue: 'manual',
    },
    {
      name: 'manualProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData.selectionMode === 'manual',
      }
    },
    {
      name: 'collection',
      type: 'relationship',
      relationTo: 'collections',
      admin: {
        condition: (_, siblingData) => siblingData.selectionMode === 'collection',
      }
    },
    {
      name: 'columns',
      type: 'group',
      fields: [
        {
          name: 'desktop',
          type: 'number',
          defaultValue: 4,
        },
        {
          name: 'tablet',
          type: 'number',
          defaultValue: 2,
        },
        {
          name: 'mobile',
          type: 'number',
          defaultValue: 1,
        }
      ]
    }
  ],
};
