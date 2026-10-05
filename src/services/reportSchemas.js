import { z } from 'zod'

const storySchema = z.object({
  storyId:     z.string().min(1, 'Story ID is required'),
  title:       z.string().min(1, 'Title is required'),
  points:      z.coerce.number({ invalid_type_error: 'Must be a number' })
                 .min(0, 'Cannot be negative'),
  status:      z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CARRIED_OVER'], {
                 errorMap: () => ({ message: 'Select a status' }),
               }),
})

const blockerSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  type:        z.enum(['TECHNICAL', 'PROCESS', 'DEPENDENCY', 'OTHER'], {
                 errorMap: () => ({ message: 'Select a type' }),
               }),
  impact:      z.enum(['LOW', 'MEDIUM', 'HIGH'], {
                 errorMap: () => ({ message: 'Select an impact level' }),
               }),
  resolved:    z.boolean(),
})

export const reportSchema = z.object({
  // Sprint section
  sprintName:       z.string().min(1, 'Sprint name is required'),
  projectName:      z.string().min(1, 'Project name is required'),

  // Delivery section
  committedPoints:  z.coerce.number({ invalid_type_error: 'Must be a number' })
                      .min(0, 'Cannot be negative'),
  completedPoints:  z.coerce.number({ invalid_type_error: 'Must be a number' })
                      .min(0, 'Cannot be negative'),
  spilloverPoints:  z.coerce.number({ invalid_type_error: 'Must be a number' })
                      .min(0, 'Cannot be negative'),

  // Dynamic arrays
  stories:  z.array(storySchema).min(1, 'Add at least one story'),
  blockers: z.array(blockerSchema),

  // Reflection
  wentWell:     z.string().min(1, 'Required'),
  couldImprove: z.string().min(1, 'Required'),
  learned:      z.string().min(1, 'Required'),
})

// Draft allows mostly empty content — only sprint + project are required.
export const draftSchema = reportSchema.extend({
  committedPoints:  z.coerce.number().min(0).optional().default(0),
  completedPoints:  z.coerce.number().min(0).optional().default(0),
  spilloverPoints:  z.coerce.number().min(0).optional().default(0),
  stories:          z.array(storySchema).optional().default([]),
  blockers:         z.array(blockerSchema).optional().default([]),
  wentWell:         z.string().optional().default(''),
  couldImprove:     z.string().optional().default(''),
  learned:          z.string().optional().default(''),
})