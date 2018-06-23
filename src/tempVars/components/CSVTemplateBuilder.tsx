import React, {PureComponent, ChangeEvent} from 'react'
import {getDeep} from 'src/utils/wrappers'

import {ErrorHandling} from 'src/shared/decorators/errors'

import TemplatePreviewList from 'src/tempVars/components/TemplatePreviewList'
import DragAndDrop from 'src/shared/components/DragAndDrop'
import {notifyCSVUploadFailed} from 'src/shared/copy/notifications'

import {TemplateBuilderProps, TemplateValueType, TemplateValue} from 'src/types'

interface State {
  templateValues: string[]
  templateValuesString: string
}

@ErrorHandling
class CSVTemplateBuilder extends PureComponent<TemplateBuilderProps, State> {
  public constructor(props: TemplateBuilderProps) {
    super(props)
    const templateValues = props.template.values.map(v => v.value)

    this.state = {
      templateValues,
      templateValuesString: templateValues.join(', '),
    }
  }

  public render() {
    const {templateValues, templateValuesString} = this.state
    const {onUpdateDefaultTemplateValue} = this.props
    const pluralizer = templateValues.length === 1 ? '' : 's'
    return (
      <>
        <DragAndDrop
          submitText="Preview"
          fileTypesToAccept={this.validFileExtension}
          handleSubmit={this.handleUploadFile}
          submitOnDrop={true}
        />
        <div className="temp-builder csv-temp-builder" style={{zIndex: 9010}}>
          <div className="form-group" style={{zIndex: 9010}}>
            <label>Comma Separated Values</label>
            <div className="temp-builder--mq-controls">
              <textarea
                className="form-control"
                value={templateValuesString}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
              />
            </div>
          </div>
        </div>
        <div className="temp-builder-results">
          <p>
            CSV contains <strong>{templateValues.length}</strong> value{
              pluralizer
            }
          </p>
          {templateValues.length > 0 && (
            <TemplatePreviewList
              items={templateValues}
              defaultValue={this.defaultValue}
              onUpdateDefaultTemplateValue={onUpdateDefaultTemplateValue}
            />
          )}
        </div>
      </>
    )
  }

  private handleUploadFile = (
    uploadContent: string,
    fileName: string
  ): void => {
    const {template, onUpdateTemplate} = this.props

    const fileExtensionRegex = new RegExp(`${this.validFileExtension}$`)
    if (!fileName.match(fileExtensionRegex)) {
      this.props.notify(notifyCSVUploadFailed())
      return
    }

    this.setState({templateValuesString: uploadContent})

    const nextValues = this.getValuesFromString(uploadContent)

    onUpdateTemplate({...template, values: nextValues})
  }

  private handleBlur = (): void => {
    const {template, onUpdateTemplate} = this.props
    const {templateValuesString} = this.state

    const nextValues = this.getValuesFromString(templateValuesString)

    onUpdateTemplate({...template, values: nextValues})
  }

  private get validFileExtension(): string {
    return '.csv'
  }

  private get defaultValue(): string {
    const {template} = this.props
    const defaultTemplateValue = template.values.find(v => v.default)
    return getDeep<string>(defaultTemplateValue, 'value', '')
  }

  private handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({templateValuesString: e.target.value})
  }

  private getValuesFromString(templateValuesString) {
    let templateValues

    if (templateValuesString.trim() === '') {
      templateValues = []
    } else {
      templateValues = templateValuesString.split(',').map(s => s.trim())
    }

    // account for newline separated values.
    // de-duplicate entries
    // remove empty strings

    this.setState({templateValues})

    const nextValues = templateValues.map((value: string): TemplateValue => {
      return {
        type: TemplateValueType.CSV,
        value,
        selected: false,
        default: false,
      }
    })

    return nextValues
  }
}

export default CSVTemplateBuilder
