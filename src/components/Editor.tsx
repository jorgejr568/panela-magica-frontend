import {
  BoldItalicUnderlineToggles,
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
  ]} className={cn("w-full prose max-w-full dark:prose-invert", props.className)}/>
}
