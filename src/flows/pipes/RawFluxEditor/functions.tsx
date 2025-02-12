import React, {FC, useState, useMemo, useCallback} from 'react'

import {EmptyState, ComponentSize} from '@influxdata/clockface'
import {FLUX_FUNCTIONS} from 'src/shared/constants/fluxFunctions'
import {FluxToolbarFunction} from 'src/types/shared'
import Fn from './function'
import SearchWidget from 'src/shared/components/search_widget/SearchWidget'

interface Props {
  onSelect: (fn: FluxToolbarFunction) => void
}

interface FilteredFn {
  [key: string]: FluxToolbarFunction[]
}

const Functions: FC<Props> = ({onSelect}) => {
  const [search, setSearch] = useState('')
  const updateSearch = useCallback(
    text => {
      setSearch(text)
    },
    [search, setSearch]
  )

  const filteredFunctions: FilteredFn = useMemo(
    () =>
      FLUX_FUNCTIONS.filter(fn => {
        return (
          !search.length || fn.name.toLowerCase().includes(search.toLowerCase())
        )
      }).reduce((acc, fn) => {
        if (!acc[fn.category]) {
          acc[fn.category] = [] as FluxToolbarFunction[]
        }

        acc[fn.category].push(fn)

        return acc
      }, {}),
    [search]
  )

  return useMemo(() => {
    let fnComponent

    if (!Object.keys(filteredFunctions).length) {
      fnComponent = (
        <EmptyState size={ComponentSize.ExtraSmall}>
          <EmptyState.Text>No functions match your search</EmptyState.Text>
        </EmptyState>
      )
    } else {
      fnComponent = Object.entries(filteredFunctions).map(([category, fns]) => (
        <dl className="flux-toolbar--category" key={category}>
          <dt className="flux-toolbar--heading">{category}</dt>
          {fns.map(fn => (
            <Fn
              onClickFunction={onSelect}
              key={`${fn.name}_${fn.desc}`}
              func={fn}
              testID={fn.name}
            />
          ))}
        </dl>
      ))
    }

    return (
      <div className="flux-toolbar">
        <div className="flux-toolbar--search">
          <SearchWidget
            placeholderText="Filter Functions..."
            onSearch={updateSearch}
            searchTerm={search}
            testID="flux-toolbar-search--input"
          />
        </div>
        <div className="flux-toolbar--list" data-testid="flux-toolbar--list">
          {fnComponent}
        </div>
      </div>
    )
  }, [search, onSelect])
}

export default Functions
