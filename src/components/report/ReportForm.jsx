import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Input from '../ui/Input.jsx'
import Textarea from '../ui/Textarea.jsx'
import Select from '../ui/Select.jsx'
import Checkbox from '../ui/Checkbox.jsx'
import Button from '../ui/Button.jsx'

import { reportSchema, draftSchema } from '../../services/reportSchemas.js'

const DEFAULT_STORY   = { storyId: '', title: '', points: '', status: 'TODO' }
const DEFAULT_BLOCKER = { description: '', type: 'TECHNICAL', impact: 'MEDIUM', resolved: false }

function Section({ title, children }) {
  return (
    <div className="rform__section">
      <h3 className="rform__section-title">{title}</h3>
      {children}
    </div>
  )
}

/**
 * Props:
 *   defaultValues  – pre-populated when editing an existing report
 *   onSend(action, data) – called with 'DRAFT' or 'SUBMIT' and the validated payload
 *   submitting     – 'DRAFT' | 'SUBMIT' | false  (controlled by parent)
 *   submitLabel    – override the submit button label (default: "Submit report")
 */
export default function ReportForm({
  defaultValues,
  onSend,
  submitting,
  submitLabel = 'Submit report',
}) {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: defaultValues ?? {
      sprintName: '', projectName: '',
      committedPoints: '', completedPoints: '', spilloverPoints: '',
      stories: [DEFAULT_STORY],
      blockers: [],
      wentWell: '', couldImprove: '', learned: '',
    },
  })

  const { fields: storyFields,   append: appendStory,   remove: removeStory   } =
    useFieldArray({ control, name: 'stories' })
  const { fields: blockerFields, append: appendBlocker, remove: removeBlocker } =
    useFieldArray({ control, name: 'blockers' })

  // Native form submit: RHF has already validated via reportSchema.
  const onValidSubmit = (values) => {
    if (submitting) return
    onSend('SUBMIT', values)
  }

  // Save draft: uses relaxed draftSchema, bypasses RHF validation.
  const onDraft = () => {
    if (submitting) return
    const result = draftSchema.safeParse(getValues())
    if (result.success) {
      onSend('DRAFT', result.data)
    }
  }

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} noValidate>

      {/* Sprint */}
      <Section title="Sprint">
        <div className="rform__row-2">
          <Input id="sprintName" label="Sprint name" placeholder="Sprint 24"
            error={errors.sprintName?.message} {...register('sprintName')} />
          <Input id="projectName" label="Project" placeholder="Payments Platform"
            error={errors.projectName?.message} {...register('projectName')} />
        </div>
      </Section>

      {/* Delivery */}
      <Section title="Delivery">
        <div className="rform__row-3">
          <Input id="committedPoints" label="Committed points" type="number" min="0" placeholder="0"
            error={errors.committedPoints?.message} {...register('committedPoints')} />
          <Input id="completedPoints" label="Completed points" type="number" min="0" placeholder="0"
            error={errors.completedPoints?.message} {...register('completedPoints')} />
          <Input id="spilloverPoints" label="Spillover points" type="number" min="0" placeholder="0"
            error={errors.spilloverPoints?.message} {...register('spilloverPoints')} />
        </div>
      </Section>

      {/* Stories */}
      <Section title="Stories">
        {(errors.stories?.root?.message || errors.stories?.message) && (
          <p className="field__error" style={{ marginBottom: 12 }}>
            {errors.stories?.root?.message ?? errors.stories?.message}
          </p>
        )}
        {storyFields.map((field, i) => (
          <div key={field.id} className="rform__array-row">
            <div className="rform__array-fields rform__row-4">
              <Input id={`stories.${i}.storyId`} label="Story ID" placeholder="SP-101"
                error={errors.stories?.[i]?.storyId?.message} {...register(`stories.${i}.storyId`)} />
              <Input id={`stories.${i}.title`} label="Title" placeholder="Implement checkout retry"
                error={errors.stories?.[i]?.title?.message} {...register(`stories.${i}.title`)} />
              <Input id={`stories.${i}.points`} label="Points" type="number" min="0" placeholder="0"
                error={errors.stories?.[i]?.points?.message} {...register(`stories.${i}.points`)} />
              <Select id={`stories.${i}.status`} label="Status"
                error={errors.stories?.[i]?.status?.message} {...register(`stories.${i}.status`)}>
                <option value="TODO">To do</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="DONE">Done</option>
                <option value="CARRIED_OVER">Carried over</option>
              </Select>
            </div>
            {storyFields.length > 1 && (
              <button type="button" className="rform__remove-btn"
                onClick={() => removeStory(i)} aria-label="Remove story">
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" className="rform__add-btn"
          onClick={() => appendStory(DEFAULT_STORY)}>
          + Add story
        </button>
      </Section>

      {/* Blockers */}
      <Section title="Blockers">
        {blockerFields.length === 0 && (
          <p className="rform__empty-note">No blockers? Leave this section empty.</p>
        )}
        {blockerFields.map((field, i) => (
          <div key={field.id} className="rform__array-row">
            <div className="rform__array-fields">
              <Textarea id={`blockers.${i}.description`} label="Description" rows={2}
                placeholder="Describe the blocker…"
                error={errors.blockers?.[i]?.description?.message}
                {...register(`blockers.${i}.description`)} />
              <div className="rform__row-3">
                <Select id={`blockers.${i}.type`} label="Type"
                  error={errors.blockers?.[i]?.type?.message} {...register(`blockers.${i}.type`)}>
                  <option value="TECHNICAL">Technical</option>
                  <option value="PROCESS">Process</option>
                  <option value="DEPENDENCY">Dependency</option>
                  <option value="OTHER">Other</option>
                </Select>
                <Select id={`blockers.${i}.impact`} label="Impact"
                  error={errors.blockers?.[i]?.impact?.message} {...register(`blockers.${i}.impact`)}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </Select>
                <div className="rform__checkbox-wrap">
                  <Controller name={`blockers.${i}.resolved`} control={control}
                    render={({ field: f }) => (
                      <Checkbox id={`blockers.${i}.resolved`} label="Resolved"
                        checked={f.value} onChange={f.onChange} />
                    )} />
                </div>
              </div>
            </div>
            <button type="button" className="rform__remove-btn"
              onClick={() => removeBlocker(i)} aria-label="Remove blocker">
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="rform__add-btn"
          onClick={() => appendBlocker(DEFAULT_BLOCKER)}>
          + Add blocker
        </button>
      </Section>

      {/* Reflection */}
      <Section title="Reflection">
        <Textarea id="wentWell" label="What went well?" rows={3}
          placeholder="Things that worked as expected or exceeded expectations…"
          error={errors.wentWell?.message} {...register('wentWell')} />
        <Textarea id="couldImprove" label="What could improve?" rows={3}
          placeholder="Processes, communication, or technical areas to address…"
          error={errors.couldImprove?.message} {...register('couldImprove')} />
        <Textarea id="learned" label="What did you learn?" rows={3}
          placeholder="Key takeaways from this sprint…"
          error={errors.learned?.message} {...register('learned')} />
      </Section>

      {/* Actions */}
      <div className="rform__actions">
        <Button type="button" variant="ghost" disabled={!!submitting} onClick={onDraft}>
          {submitting === 'DRAFT' ? 'Saving…' : 'Save draft'}
        </Button>
        <Button type="submit" variant="primary" disabled={!!submitting}>
          {submitting === 'SUBMIT' ? 'Submitting…' : submitLabel}
        </Button>
      </div>

    </form>
  )
}