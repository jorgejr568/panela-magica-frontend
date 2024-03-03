import {
  BoldItalicUnderlineToggles,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  MDXEditorProps,
  quotePlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import React from "react";
import {cn} from "@/lib/utils";
import '@mdxeditor/editor/style.css'

export default function Editor({plugins, ...props}: MDXEditorProps) {
  return <MDXEditor
    {...props} plugins={[
    headingsPlugin(),
    listsPlugin(),
    quotePlugin(),
    markdownShortcutPlugin(),
    toolbarPlugin({
      toolbarContents: () => (
        <>
          <BoldItalicUnderlineToggles/>
          <UndoRedo/>
        </>
      )
    }),
    ...(plugins || [])
  ]} className={cn("w-full prose dark:prose-invert", 'max-w-full min-w-full', props.className)}
  />
}
