import React, { Children, cloneElement, isValidElement } from 'react'
import { View, ViewProps } from 'react-native'

import {
  AxisX,
  AxisY,
  Breakpoint,
  ResponsiveProp,
  Space,
  lastFactory,
  resolveAlign,
  resolveCollapsibleProps,
  resolveDirection,
  resolveJustify,
  styles,
} from '../utils'
import { ColumnsContext, useBreakpoint, useDebugStyle, useSpacing } from '../context'

export interface Props extends ViewProps {
  children: React.ReactNode
  space?: ResponsiveProp<number>
  reverse?: boolean
  alignY?: ResponsiveProp<AxisY>
  alignX?: ResponsiveProp<Exclude<AxisX, 'stretch'> | Space>
  collapseBelow?: Exclude<Breakpoint, 'mobile'>
}

export const Columns = (props: Props) => {
  const {
    children,
    space = 0,
    reverse = false,
    alignX: responsiveAlignX,
    alignY: responsiveAlignY,
    style,
    collapseBelow,
    ...rest
  } = props
  const { resolveResponsiveProp, currentBreakpoint } = useBreakpoint()
  const elements = Children.toArray(children)
  const isLast = lastFactory(elements)
  const debugStyle = useDebugStyle()

  const alignX = resolveResponsiveProp(responsiveAlignX)
  const alignY = resolveResponsiveProp(responsiveAlignY)
  const margin = useSpacing(resolveResponsiveProp(space))

  const {
    noLastMargin,
    noOppositeMargin,
    spacing,
    direction,
    isCollapsed,
  } = resolveCollapsibleProps({
    currentBreakpoint,
    collapseBelow,
    reverse,
    margin,
  })

  return (
    <ColumnsContext.Provider value={{ isCollapsed }}>
      <View
        style={[
          styles.fullWidth,
          style,
          resolveDirection(direction),
          resolveAlign(alignY),
          resolveJustify(alignX),
        ]}
        {...rest}
      >
        {elements.map((child, index) => {
          const marginStyle = isLast(index) ? noLastMargin : spacing

          return isValidElement(child)
            ? cloneElement(child, {
                ...child.props,
                style: [child.props.style, debugStyle, noOppositeMargin, marginStyle],
              })
            : null
        })}
      </View>
    </ColumnsContext.Provider>
  )
}
