import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Grommet,
  Anchor,
  Box,
  Stack,
  Text,
  TextInput,
  RangeInput,
  RangeSelector,
  base
} from 'grommet'

const xMax = 400
const yMax = 150

const outer = (x, amplitude) => Math.round((amplitude * (x + 1)) / 2)
const inner = (x, phase, multiplier) => multiplier * (x + phase)

const Plot = ({
  lineWidth,
  wavelength,
  amplitude,
  phase1,
  phase2,
  strand1,
  strand2,
  barMajor,
  barMinor,
  barGap
}) => {
  let field = new Array(xMax)

  for (var i = 0; i < field.length; i++) {
    field[i] = new Array(yMax)
  }

  let y1, y2, z1, z2
  let plot = ''
  let multiplier = (2 * Math.PI) / wavelength

  for (let x = 0; x < lineWidth - 1; x++) {
    y1 = outer(Math.sin(inner(x, phase1, multiplier)), amplitude)
    y2 = outer(Math.sin(inner(x, phase2, multiplier)), amplitude)
    z1 = outer(Math.cos(inner(x, phase1, multiplier)), amplitude)
    z2 = outer(Math.cos(inner(x, phase2, multiplier)), amplitude)
    if (x % barGap === 0) {
      if (y1 < y2) {
        for (let y = y1; y < y2; y++) {
          field[x][y] = barMajor
        }
      } else {
        for (let y = y2; y < y1; y++) {
          field[x][y] = barMinor
        }
      }
    }
    if (z1 > z2) {
      field[x][y2] = strand2
      field[x][y1] = strand1
    } else {
      field[x][y1] = strand1
      field[x][y2] = strand2
    }
  }

  for (let y = 0; y < Math.round(amplitude); y++) {
    let line = ''
    for (let x = 0; x < lineWidth; x++) {
      line += field[x][y] || ' '
    }
    plot += line + '\n'
  }

  const OutputPre = styled.pre`
    max-width: 100%;
    max-height: 100%;
    overflow: scroll;
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    color: ${base.global.colors['accent-1']};
    ::selection {
      background: ${base.global.colors['accent-1']};
      color: black;
    }
  `

  return (
    <>
      <OutputPre>{plot}</OutputPre>
    </>
  )
}

const App = () => {
  const theme = {
    global: {
      spacing: '12px',
      font: {
        family: 'Roboto Mono',
        size: '12px'
      }
    },
    rangeInput: {
      track: {
        height: '1px'
      }
    }
  }

  const LabelText = styled(Text)`
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 8px;
    margin-bottom: auto;
  `

  const [plotConfig, setPlotConfig] = useState({
    lineWidth: 160,
    wavelength: 48,
    amplitude: 16,
    phase1: -2,
    phase2: 8,
    strand1: 'W',
    strand2: 'C',
    barMajor: '|',
    barMinor: ':',
    barGap: 3
  })

  const strandSuggestions = ['#', 'X', '%', '*', '+', '-', 'W', 'C']
  const barSuggestions = ['|', ':', '!']

  return (
    <Grommet theme={theme} full>
      <Box background="black" pad="medium" fill>
        <Box direction="row-responsive">
          <Box basis="3/4" direction="row-responsive" justify="around" height="auto">
            <Box pad="xsmall" basis="medium">
              <LabelText>Line Width</LabelText>
              <RangeInput
                value={plotConfig.lineWidth}
                onChange={event =>
                  setPlotConfig({
                    ...plotConfig,
                    lineWidth: parseInt(event.target.value)
                  })
                }
                min={0}
                max={400}
              />
            </Box>
            <Box pad="xsmall" basis="medium">
              <LabelText>Wavelength</LabelText>
              <RangeInput
                value={plotConfig.wavelength}
                onChange={event =>
                  setPlotConfig({
                    ...plotConfig,
                    wavelength: parseInt(event.target.value)
                  })
                }
                min={0}
              />
            </Box>
            <Box pad="xsmall" basis="medium">
              <LabelText>Amplitude</LabelText>

              <RangeInput
                value={plotConfig.amplitude}
                onChange={event =>
                  setPlotConfig({
                    ...plotConfig,
                    amplitude: parseInt(event.target.value)
                  })
                }
                min={0}
                max={150}
              />
            </Box>
            <Box pad="xsmall" basis="medium">
              <LabelText>Bar Gap</LabelText>

              <RangeInput
                value={plotConfig.barGap}
                onChange={event =>
                  setPlotConfig({
                    ...plotConfig,
                    barGap: parseInt(event.target.value)
                  })
                }
                min={0}
                max={parseInt(plotConfig.lineWidth / 10)}
              />
            </Box>
            <Box pad="xsmall" basis="medium">
              <LabelText>Shift</LabelText>

              <Stack>
                <Box height="14px" width="medium"></Box>
                <RangeSelector
                  direction="horizontal"
                  invert={false}
                  min={-10}
                  max={10}
                  values={[plotConfig.phase1, plotConfig.phase2]}
                  onChange={values =>
                    setPlotConfig({
                      ...plotConfig,
                      phase1: values[0],
                      phase2: values[1]
                    })
                  }
                />
              </Stack>
            </Box>
          </Box>
          <Box basis="1/4" direction="row" justify="between">
            <Box pad="xsmall" basis="xsmall">
              <LabelText>Strand</LabelText>
              <TextInput
                value={plotConfig.strand1}
                onChange={event =>
                  setPlotConfig({
                    ...plotConfig,
                    strand1: event.target.value.slice(0, 1)
                  })
                }
                onSelect={event =>
                  setPlotConfig({
                    ...plotConfig,
                    strand1: event.suggestion
                  })
                }
                suggestions={strandSuggestions}
              />
            </Box>

            <Box pad="xsmall" basis="xsmall">
              <LabelText>Strand</LabelText>
              <TextInput
                value={plotConfig.strand2}
                onChange={event =>
                  setPlotConfig({
                    ...plotConfig,
                    strand2: event.target.value.slice(0, 1)
                  })
                }
                onSelect={event =>
                  setPlotConfig({
                    ...plotConfig,
                    strand2: event.suggestion
                  })
                }
                suggestions={strandSuggestions}
              />
            </Box>

            <Box pad="xsmall" basis="xsmall">
              <LabelText>Bar</LabelText>
              <TextInput
                value={plotConfig.barMajor}
                onChange={event =>
                  setPlotConfig({
                    ...plotConfig,
                    barMajor: event.target.value.slice(0, 1)
                  })
                }
                onSelect={event =>
                  setPlotConfig({
                    ...plotConfig,
                    barMajor: event.suggestion
                  })
                }
                suggestions={barSuggestions}
              />
            </Box>

            <Box pad="xsmall" basis="xsmall">
              <LabelText>Bar</LabelText>
              <TextInput
                value={plotConfig.barMinor}
                onChange={event =>
                  setPlotConfig({
                    ...plotConfig,
                    barMinor: event.target.value.slice(0, 1)
                  })
                }
                onSelect={event =>
                  setPlotConfig({
                    ...plotConfig,
                    barMinor: event.suggestion
                  })
                }
                suggestions={barSuggestions}
              />
            </Box>
          </Box>
        </Box>

        <Box align="center" justify="center" fill>
          <Plot {...plotConfig} />
        </Box>

        <Box align="center">
          <LabelText>
            Adapted by{' '}
            <Anchor href="https://wireform.io" rel="noopener">
              Jeff
            </Anchor>{' '}
            from the original{' '}
            <Anchor href="http://users.fred.net/tds/lab/delila/asciidna.html" rel="noopener">
              Delila ASCII DNA
            </Anchor>{' '}
            by Thomas D. Schneider
          </LabelText>
        </Box>
      </Box>
    </Grommet>
  )
}

export default App
