export const tooltip: any = {
    callbacks: {
      title: (tooltipItems: any) => {
        const item = tooltipItems[0]
        return item.label
      },
      label: (context: any) => {
        const label = context.dataset.label || ''
        const data = context.raw.y
        return `${label} ${data}`
      },
      labelColor: (data: any) => {
        return {
          backgroundColor: data.element.options.backgroundColor,
          borderColor: data.element.options.backgroundColor,
          borderWidth: 2,
          borderRadius: 2,
        }
      },
    },
  }